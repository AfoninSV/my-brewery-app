from typing import List, Optional
from datetime import datetime
import time
import logging
import sched
import threading

from pytz import timezone
from sqlalchemy import ForeignKey, String, Integer, Boolean, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.orm import Session

from settings import DB_URI


class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(primary_key=True)

class User(Base):
    __tablename__ = "user"

    name: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String(30), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    cameraId: Mapped[str] = mapped_column(String(100), nullable=True)    
    cycles: Mapped[List["Cycle"]] = relationship(back_populates="user")

    def __repr__(self) -> str:
        return f"User({self.id=}, {self.name=})"

class Cycle(Base):
    __tablename__ = "cycle"

    entries: Mapped[str] = mapped_column(String(50), nullable=False)

    datetime: Mapped[str] = mapped_column(String(20), default=lambda: datetime.now(timezone("Canada/Atlantic")).strftime("%d/%b/%Y, %H:%M"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="cycles")
    
    def __repr__(self) -> str:
        return f"Cycle( {self.entries=} )"


class Url(Base):
    __tablename__ = "urls"

    url: Mapped[str] = mapped_column(String(300), nullable=False)
    day: Mapped[str] = mapped_column(Integer(), nullable=False)
    collected: Mapped[bool] = mapped_column(Boolean, nullable=False)
    
    def __repr__(self) -> str:
        return f"Url( Day {self.day}: {self.url=}: {self.collected=} )"


class DeliveriesTotal(Base):
    __tablename__ = "deliveries_total"

    title: Mapped[str] = mapped_column(String(100))
    quantity: Mapped[int] = mapped_column(Integer())
    day: Mapped[int] = mapped_column(Integer())
    
    def __repr__(self) -> str:
        return f"Product( {self.day=} {self.title=}: {self.quantity=} )"

class EkosTotal(Base):
    __tablename__ = "ekos_total"

    title: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity: Mapped[str] = mapped_column(Integer(), nullable=False)
    
    def __repr__(self) -> str:
        return f"Product( {self.title=}: {self.quantity=} )"

class KegshoeTotal(Base):
    __tablename__ = "kegshoe_total"

    title: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity: Mapped[str] = mapped_column(Integer(), nullable=False)
    
    def __repr__(self) -> str:
        return f"Product( {self.title=}: {self.quantity=} )"


engine = create_engine(DB_URI)
session = Session(engine)


DeliveriesTotal.__table__.drop(engine)
Url.__table__.drop(engine)

Base.metadata.create_all(engine)


def schedule_deliveries_table_removal():
    scheduler = sched.scheduler(time.time, time.sleep)
    now = datetime.now()
    midnight = datetime(year=now.year, month=now.month, day=now.day+1, hour=1)

    scheduler.enterabs(datetime.timestamp(midnight), 1, remove_deliveries)
    threading.Thread(target=scheduler.run).start()
    logging.info(f"Task to remove deliveries/urls was cheduled at {midnight}")


def get_invoices_links(month_day: int) -> list[str]:
    with session as ss:
        urls = [url.url for url in ss.query(Url).where(Url.day == month_day, Url.collected == False).all()]
    return urls

def add_ekos_total(item: str, qty: int):
    with session as ss:
        item_found = ss.query(EkosTotal).where(EkosTotal.title == item).first()
        if item_found:
            item_found.quantity += qty
        else:
            total = EkosTotal(title=item, quantity=qty)
            ss.add(total)
        ss.commit()


def add_total(item: str, qty: int):
    with session as ss:
        item_found = ss.query(DeliveriesTotal).where(DeliveriesTotal.title == item).first()
        if item_found:
            item_found.quantity += qty
        else:
            total = DeliveriesTotal(title=item, quantity=qty)
            ss.add(total)
        ss.commit()

def remove_ekos():
    logging.info("Inside removing Ekos")
    with session as ss:
        ss.query(EkosTotal).delete()
        ss.commit()

def remove_deliveries():
    logging.info("Inside removing Deliveries")
    today = datetime.now().day

    with session as ss:
        ss.query(DeliveriesTotal).where(DeliveriesTotal.day < today).delete()
        ss.query(Url).where(Url.day < today).delete()
        ss.commit()
    logging.info("Deliveries and Urls were removed!")

    schedule_deliveries_table_removal()

def remove_kegshoe():
    logging.info("Inside removing Kegshoe")
    with session as ss:
        ss.query(KegshoeTotal).delete()
        ss.commit()

def get_deliveries_total(month_day):
    logging.info("INside getting deliveries total...")
    with session as ss:
        total = ss.query(DeliveriesTotal).where(DeliveriesTotal.day == month_day).all()
        
        if total:
            return {row.title: row.quantity for row in total}
        logging.info("Returning empty deliveries total!")
        return {}

def get_ekos_total():
    with session as ss:
        total = ss.query(EkosTotal).all()
        if total:
            return {row.title: row.quantity for row in total}
        return {}

def get_kegshoe_total():
    with session as ss:
        total = ss.query(KegshoeTotal).all()
        if total:
            return {row.title: row.quantity for row in total}
        return {}


def if_email_exists(email: str) -> Optional[User]:
    with session as ss:
        user_exists = ss.query(User).where(User.email == email).first()
    return user_exists


def del_user(user_id):
    with session as ss:
        user = ss.query(User).where(User.id == user_id).delete()
        ss.commit()

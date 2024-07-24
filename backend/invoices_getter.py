from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pathlib import Path
from datetime import datetime
from time import perf_counter
import logging
import os

from database import (get_deliveries_total, get_ekos_total, get_kegshoe_total, get_invoices_links,
                      session, DeliveriesTotal, EkosTotal, KegshoeTotal, Url)


is_browser_open = False
links = []


def time_counter(func):
    def count_time(*args, **kwargs):
        start_time = perf_counter()
        res = func(*args, **kwargs)
        logging.info(f"Func {func.__name__} exec time is {perf_counter() - start_time} sec")
        return res
    return count_time


def browser_start():
    global driver
    br_path = os.path.join(Path(__file__).parent.absolute(), "chrome-linux64", "chrome")
    dr_path = os.path.join(Path(__file__).parent.absolute(), "chromedriver")

    service = Service(executable_path=dr_path)
    options = webdriver.ChromeOptions()

    options.binary_location = br_path
    options.add_argument("--headless=new")
    options.add_argument("--enable-javascript")
    options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=options, service=service)
    logging.info("Started browser")


def wait_for(find_by: By, pattern: str) -> None:
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((find_by, pattern))
    )


def ekos_login() -> None:
    start_time = perf_counter()
    driver.get("https://login.goekos.com/")

    wait_for(By.ID, "txtUsername")

    login_input = driver.find_element(By.ID, "txtUsername")
    login_input.clear()
    login_input.send_keys("YOUR_LOGIN")    #TODO Write your own login

    pass_input = driver.find_element(By.ID, "txtPassword")
    pass_input.send_keys("YOUR_PASSWORD")    #TODO Write your own password

    login_btn = driver.find_element(By.ID, "btnLogin").click()
    wait_for(By.XPATH, "//*[contains(text(), 'Garrison Brewing')]")
    logging.info(f"Logged into Ekos. It took {perf_counter() - start_time} sec")


def try_open_invoices(day_value: str = "today") -> None:
    
    day_value = day_value.replace("_", " ").title()
    logging.info(f"try_open_invoices - {day_value=}")

    def open_invoices() -> bool:

        try:
            driver.get("https://app.goekos.com/03.00/Invoice")
            wait_for(By.XPATH, "//span[text()='All']")
            driver.find_elements(By.XPATH, "//span[text()='All']")[2].click()
            driver.find_element(By.XPATH, f"//*[contains(text(), '{day_value}')]").click()
        except Exception as e:
            logging.error(f"Unexpected err when opening invoices tab:", e)
            return False

        wait_for(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[4]/div[3]/div[1]/div[1]/button/div/span")
        

        driver.find_element(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[4]/div[3]/div[1]/div[1]/button/div/span").click()
        driver.find_element(By.XPATH, "/html/body/div[7]/div/div/div/button[5]/p").click()

        return True
        
    while True:
        if open_invoices():
            break


def collect_invoices_links(month_day: int) -> None:

    start_time = perf_counter()

    wait_for(By.XPATH, "//a[contains(text(), 'GBC')]")

    for inv in driver.find_elements(By.XPATH, "//*[contains(text(), 'GBC')]"):

        href = inv.get_attribute("href")
        if href:
            logging.info(f"href = {href}")
            with session as ss:
                if (delivery := ss.query(Url).where(Url.url == href).first()):
                    logging.info(f"Inside if url, {delivery.url=}")
                    continue
                else:
                    ss.add(Url(url=href, day=month_day, collected=False))
                    ss.commit()
                    #links.append(href)
    logging.info(f"LInks collected, it took {perf_counter() - start_time} sec")


def collect_data(month_day: int) -> None:
    """Collect invoices items"""

    start_time = perf_counter()

    links = get_invoices_links(month_day)


    if len(links) == 0:
        logging.info("Don't collect data, 'links' var is empty")
        logging.info(f"Invoices collected. It took {perf_counter() - start_time} sec")
        return

    logging.info("Collecting invoices...")
    

    for link in links:
        driver.get(link)

        wait_for(By.ID, "classicContainer")

        iframe_element = driver.find_element(By.ID, "classicContainer")
        driver.switch_to.frame(iframe_element)

        wait_for(By.XPATH, "//a[@class='itemLink']")
        wait_for(By.XPATH, "//*[@id='invoice_items_table']/tbody/tr/td[2]/input")

        plain_items = [item.text for item in driver.find_elements(By.XPATH, "//a[@class='itemLink']")]
        items_numbers = [element.get_attribute("value") for element in driver.find_elements(By.XPATH, "//*[@id='invoice_items_table']/tbody/tr/td[2]/input")]

        full_items_string = ""
        for qty, item in zip(items_numbers, plain_items):
            if "Case" in item:
                continue
            qty = int(qty)

            with session as ss:
                item_found = ss.query(DeliveriesTotal).where(DeliveriesTotal.day == month_day, DeliveriesTotal.title == item).first()
            
                if item_found:
                    item_found.quantity += qty
                else:  
                    total = DeliveriesTotal(title=item, quantity=qty, day=month_day)
                    ss.add(total)

                ss.commit()
        with session as ss:
            delivery = ss.query(Url).where(Url.url == link).first()
            delivery.collected = True
            ss.commit()
        # end for loop...
        
    logging.info(f"Invoices collected. It took {perf_counter() - start_time} sec")

@time_counter
def collect_ekos_total():
    driver.get("https://app.goekos.com/03.00/inventory")
    wait_for(By.XPATH, "//*[@id='content']/div[3]/div[3]/div[2]/div[4]/div/div/button/div/span[1]")

    driver.find_element(By.XPATH, "//*[@id='content']/div[3]/div[3]/div[2]/div[4]/div/div/button/div/span[1]").click()
    wait_for(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[3]/div[2]/div[4]/div/div/div/div[3]/div[2]/label/div")
    driver.find_element(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[3]/div[2]/div[4]/div/div/div/div[3]/div[2]/label/div").click()
    driver.find_element(By.XPATH, "//*[@id='content']/div[3]/div[3]/div[2]/div[4]/div/div/div/div[4]/button/div").click()

    wait_for(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[3]/div[2]/div[6]/div/div/button/div")
    driver.find_element(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[3]/div[2]/div[6]/div/div/button/div").click()  
    wait_for(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[3]/div[2]/div[6]/div/div/div/div[3]/div[8]/label")
    driver.find_element(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[3]/div[2]/div[6]/div/div/div/div[3]/div[8]/label").click()
    driver.find_element(By.XPATH, "//*[@id='content']/div[3]/div[3]/div[2]/div[6]/div/div/div/div[4]/button/div/span").click()

    wait_for(By.XPATH, "//*[@id='content']/div[3]/div[3]/div[6]/div[1]/button/div/span")
    driver.find_element(By.XPATH, "//*[@id='content']/div[3]/div[3]/div[6]/div[1]/button/div/span").click()
    wait_for(By.XPATH, "/html/body/div[7]/div/div/div/button[5]/p")
    driver.find_element(By.XPATH, "/html/body/div[7]/div/div/div/button[5]/p").click()

    wait_for(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[3]/div[5]/table/tbody")
 
    plain_items = [item.text for item in driver.find_elements(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[3]/div[5]/table/tbody/tr/td[2]/a")]
    items_numbers = [item.text.split(".")[0] for item in driver.find_elements(By.XPATH, "/html/body/div[1]/div/main/div[3]/div[3]/div[5]/table/tbody/tr/td[3]/p")]
    
    with session as ss:
        for title, qty in zip(plain_items, items_numbers):
            if (title == "Mango DF Sour (Keg - 20L)") or (title == "Mango DF Sour (Keg - 50L)"):
                title = title.replace("Mango DF Sour", "Dragonfruit Sour")

            qty = int(qty)
            item_found = ss.query(EkosTotal).where(EkosTotal.title == title).first()
            if item_found:
                item_found.quantity += qty
            else:
                total = EkosTotal(title=title, quantity=qty)
                ss.add(total)
        ss.commit()


@time_counter
def collect_kegshoe_total():
    browser_start()
    logging.info("Collecting Kegshoe total...")

    #start login
    driver.get("https://kegshoe.ca/login")
    wait_for(By.XPATH, "/html/body/section/div/div/form/fieldset/div[1]/input")
    login_field = driver.find_element(By.XPATH, "/html/body/section/div/div/form/fieldset/div[1]/input")
    login_field.clear()
    login_field.send_keys("YOUR_LOGIN")    #TODO Write your own login

    psw_field = driver.find_element(By.XPATH, "/html/body/section/div/div/form/fieldset/div[2]/input")
    psw_field.send_keys("YOUR_PASSWORD")    #TODO Write your own password

    driver.find_element(By.XPATH, "/html/body/section/div/div/form/fieldset/button").click()
    # end login

    driver.get("https://kegshoe.ca/dashboard/location/13172")
    # wait_for(By.XPATH, "/html/body/div[2]/div[2]/main/section[1]/section[1]/div/div/div[1]/h3/a")
    wait_for(By.XPATH, "/html/body/div[2]/div[2]/main/section[1]/section[2]/div/div/div[1]/h3/a")


    driver.find_element(By.XPATH, "/html/body/div[2]/div[2]/main/section[1]/section[2]/div/div/div[1]/h3/a").click()

    wait_for(By.XPATH, "/html/body/div[2]/div[2]/main/section[1]/section[2]/div/div/div[2]/div[2]/div[1]/table")
    
    with session as ss:
        for element, qty, size in zip(driver.find_elements(By.XPATH, "/html/body/div[2]/div[2]/main/section[1]/section[2]/div/div/div[2]/div[2]/div[1]/table/tbody/tr/td[1]/a"),
                                    driver.find_elements(By.XPATH, "/html/body/div[2]/div[2]/main/section[1]/section[2]/div/div/div[2]/div[2]/div[1]/table/tbody/tr/td[4]"),
                                    driver.find_elements(By.XPATH, "/html/body/div[2]/div[2]/main/section[1]/section[2]/div/div/div[2]/div[2]/div[1]/table/tbody/tr/td[3]/a")):
            qty = int(qty.text) if qty.text else 0
            element = element.text
            if element == "Peach Pale Ale":
                element = "GEORGIA PEACH"
            elif element == "Juicy DIPA":
                element = "Juicy"
            elif element == "Hold Fast":
                element = "Hold Fast Pale Ale"
            elif element == "Hoppy Buoy IPA":
                element = "Hoppy Boy"
            elif element == "Le Grand Duc":
                element = "LE GRAND DUC"


            if size.text == "50L Keg":
                element = f"{element} (Keg - 50L)"
            else:
                element = f"{element} (Keg - 20L)"
            
            item_found = ss.query(KegshoeTotal).where(KegshoeTotal.title == element).first()
            if item_found:
                item_found.quantity += qty
            else:
                total = KegshoeTotal(title=element, quantity=qty)
                ss.add(total)
        ss.commit()
    
    driver.quit()
    
    return get_kegshoe_total()



def collect_ekos_total_standalone():
    browser_start()
    ekos_login()
    collect_ekos_total()
    driver.quit()
    return get_ekos_total()


@time_counter
def get_invoices_total(day_value: str) -> dict:

    if day_value == "today":
        month_day = datetime.now().day
    elif day_value == "tomorrow":
        month_day = datetime.now().day + 1
    
    logging.info(f"get_invoices_total: {month_day=}")

    browser_start()
    ekos_login()
    try_open_invoices(day_value=day_value)
    try:
        collect_invoices_links(month_day)
    except Exception as e:
        logging.warning("Return empty invoices list due to error: ", e)
        return {}    # return empty data if nothing found
    
    collect_data(month_day)
    driver.quit()
    return get_deliveries_total(month_day)

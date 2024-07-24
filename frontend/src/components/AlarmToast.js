import React from "react";
import { Toast, ToastHeader } from "reactstrap";

function AlarmToast({message}) {
    return (
        <Toast className='p-3 bg-danger my-2 rounded position-fixed bottom-0 end-0'>
        <ToastHeader className='text-dark'>
          {message}
        </ToastHeader>
      </Toast>
    )
}

export default AlarmToast;
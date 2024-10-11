interface INotify {
    message: string,
    ico: string
}
export const notifyByOS = (config: INotify) => {
    if (Notification.permission === 'granted') {
        new Notification(config.message,{
            icon: config.ico
        })
    } else {
        Notification.requestPermission().then((per) => {
            if (per === 'granted') { 
                new Notification(config.message,{
                    icon: config.ico
                })
             }
        })
    }
}
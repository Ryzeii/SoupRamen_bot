const tg = window.Telegram.WebApp;

export function useTelegram() {

    const onClose = ()=>{
        tg.close();
    }
    const onToggleButton = ()=>{
        if(tg.MainButton.isViseble){
            tg.MainButton.hide();
        }
        else {
            tg.MainButton.show();
        }
    }

    return {

        tg,
        user: tg.initDataUnsafe?.user,
        onClose,
        onToggleButton,
    }
}
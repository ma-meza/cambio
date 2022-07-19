import axios from "axios"

const convertedVapidKey = urlBase64ToUint8Array("BAt4xiY5kXoExdMjzxPrFIuV02M-eruCKK61i_yh1JAgh0LoMN_fXSTEvGdAw4bFE91ID4qDLlZf7A8SF8sI9bo")
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    // eslint-disable-next-line
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

function sendSubscription(subscription) {
    return axios.post(window.api_prefix+"/notifSubscribe", { subscription: subscription });
}

export function subscribeUser() {

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function (registration) {
            if (!registration.pushManager) {
                return
            }

            registration.pushManager.getSubscription().then(function (existedSubscription) {
                if (existedSubscription === null) {
                    registration.pushManager.subscribe({
                        applicationServerKey: convertedVapidKey,
                        userVisibleOnly: true,
                    }).then(function (newSubscription) {
                        console.log('New subscription added.')
                        sendSubscription(newSubscription)
                    }).catch(function (e) {
                        if (Notification.permission !== 'granted') {
                            // alert('Permission was not granted.')
                        } else {
                            // alert('An error ocurred during the subscription process.', e)
                        }
                    })
                } else {
                    // alert('Existed subscription detected.')
                    sendSubscription(existedSubscription)
                }
            })
        })
            .catch(function (e) {
                // alert('An error ocurred during Service Worker registration.', e)
            })
    }
}

export function unsubscribeNotificationUser(userToken) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function (registration) {
            if (!registration.pushManager) {
                return;
            }

            registration.pushManager.getSubscription().then(function (existedSubscription) {
                if (existedSubscription != null) {
                    return axios.post(window.api_prefix+"/notifUnsubscribe", { subscription: existedSubscription, userToken: userToken });
                }
            })
        })
            .catch(function (e) {
                return;
            })
    }
}
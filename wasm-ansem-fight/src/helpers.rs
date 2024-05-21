use std::time::Duration;

use ::futures::channel::oneshot;
use rand::Rng;
use tokio_with_wasm::tokio::time::sleep;
use wasm_bindgen::{closure::Closure, JsCast};
use wasm_bindgen_futures::JsFuture;
use web_sys::{Element, Event, HtmlAudioElement, HtmlImageElement};
#[macro_export]
macro_rules! log {
    ($res: expr) => {
        match $res {
            Ok(val) => val,
            Err(err) => {
                web_sys::console::error_1(&err);
                panic!();
            }
        }
    };
}
pub fn document_get_element_by_id(id: &str) -> Element {
    let window = web_sys::window().expect("global window does not exists");
    let document = window.document().expect("expecting a document on window");
    let val = document.get_element_by_id(id).expect("Element not found");
    return val;
}

pub fn generate_punches(min: &usize, max: &usize) -> usize {
    rand::thread_rng().gen_range(*min..*max)
}

pub async fn play_sound(path: &str) {
    let audio_element = log!(HtmlAudioElement::new());
    let n_p = format!("{}/{}", "/assets", path);
    audio_element.set_src(&n_p);
    let play_promise = JsFuture::from(log!(audio_element.play()));
    let _ = play_promise.await;
    let (tx, rx) = oneshot::channel();
    let tx = std::rc::Rc::new(std::cell::RefCell::new(Some(tx)));

    let closure = Closure::wrap(Box::new(move |_event: Event| {
        if let Some(tx) = tx.borrow_mut().take() {
            let _ = tx.send(());
        }
    }) as Box<dyn FnMut(_)>);

    audio_element.set_onended(Some(closure.as_ref().unchecked_ref()));
    closure.forget();

    let _ = rx.await;
    audio_element.set_onended(None);
    audio_element.set_src("");
}

pub async fn shake_camera(element: HtmlImageElement){
    if let Some(parent) = element.parent_element(){
        log!(parent.class_list().add_1("cameraShake"));
        sleep(Duration::from_millis(13)).await;
        log!(parent.class_list().remove_1("cameraShake"));
    }
}
#[warn(unreachable_code)]
mod config;
mod helpers;

use std::{borrow::Cow, time::Duration};
use rand::prelude::SliceRandom;
use wasm_bindgen_futures::spawn_local;
use crate::{
    config::PUNCHES_CONFIG,
    helpers::{document_get_element_by_id, generate_punches},
};
use config::{
    Characters, PunchTiers, DODGE_PROBS, FRAMES_TO_NOT_REV, IMAGE_SETS, PLAY_DODGE_SOUND_AT,
    PLAY_PUNCH_SOUNDS_AT, PLAY_PWRUP_SOUND_AT, SOUNDS, WIN_PUNCHES,
};

use std::mem;
use helpers::{play_sound, shake_camera};
use rand::Rng;
use tokio_with_wasm::tokio::time::sleep;
use wasm_bindgen::prelude::*;
use web_sys::HtmlElement;
pub struct Game<'a> {
    player: Characters,
    tier: PunchTiers,
    npunches: usize,
    doges: usize,
    lpunches: usize,
    render_buf: Cow<'a, [&'static str]>,
    temp_render_buf: Cow<'a, [&'static str]>,
    temp_t3_render_buf: Cow<'a, [&'static str]>,
    image_ref: web_sys::HtmlImageElement,
    dodges_counter_ref: web_sys::HtmlElement,
    lpunches_counter_ref: web_sys::HtmlElement,
}

impl <'a>Game<'a> {
    pub fn new(player: &str, wif: f64) -> Game {
        assert!(wif > 0.0, "WIF must be greater than 0");

        let punch_config;
        let tier;
        if wif <= 1.0 {
            punch_config = &PUNCHES_CONFIG[0];
            tier = PunchTiers::T1;
        } else if wif < 41.0 {
            punch_config = &PUNCHES_CONFIG[1];
            tier = PunchTiers::T2;
        } else {
            punch_config = &PUNCHES_CONFIG[2];
            tier = PunchTiers::T3;
        }

        let player_e = match player {
            "ansem" => Characters::ANSEM,
            "kook" => Characters::COOK,
            _ => panic!("Invalid player name: {}", player),
        };
        let render_bufs = {
            if let PunchTiers::T3 = tier {
                match player_e {
                    Characters::ANSEM => Cow::Borrowed(PUNCHES_CONFIG[1]
                        .image_arr_p1),
                    Characters::COOK => Cow::Borrowed(PUNCHES_CONFIG[1]
                        .image_arr_p2),
                }
            } else {
                match player_e {
                    Characters::ANSEM => Cow::Borrowed(punch_config
                        .image_arr_p1),
                    Characters::COOK => Cow::Borrowed(punch_config
                        .image_arr_p2),
                }
            }
        };
        Game {
            player: player_e,
            tier,
            npunches: generate_punches(&punch_config.min_punches, &punch_config.max_punches),
            doges: 0,
            lpunches: 0,
            render_buf: render_bufs.clone(),
            temp_render_buf: render_bufs,
            temp_t3_render_buf: {
                if let PunchTiers::T3 = &tier {
                    match player_e {
                        Characters::ANSEM => Cow::Borrowed(punch_config
                            .image_arr_p1),
                        Characters::COOK => Cow::Borrowed(punch_config
                            .image_arr_p2),
                    }
                }else{
                    Cow::Owned(Vec::new())
                }
            },
            image_ref: log!(document_get_element_by_id("gameImageId")
                .dyn_into::<web_sys::HtmlImageElement>()),
            dodges_counter_ref: log!(document_get_element_by_id("dodgesCounterId")
                .dyn_into::<HtmlElement>()),
            lpunches_counter_ref: log!(document_get_element_by_id("punchesCounterId")
                .dyn_into::<HtmlElement>()),
        }
    }

    pub fn randomize_punch_sequences(&mut self) {
        let dodges = rand::thread_rng().gen::<f64>() < {
            match &self.tier {
                PunchTiers::T1 => DODGE_PROBS.t1,
                PunchTiers::T2 => DODGE_PROBS.t2,
                PunchTiers::T3 => DODGE_PROBS.t3,
            }
        };
        if dodges {
            match &self.player {
                Characters::ANSEM => {
                    if rand::thread_rng().gen::<f64>() < 0.5 {
                        self.render_buf = Cow::Borrowed(&IMAGE_SETS
                            .ansem_dodge_1);
                    } else {
                        self.render_buf = Cow::Borrowed(&IMAGE_SETS
                            .ansem_dodge_2)
                    }
                }
                Characters::COOK => {
                    if rand::thread_rng().gen::<f64>() < 0.5 {
                        self.render_buf = Cow::Borrowed(&IMAGE_SETS
                            .cook_dodge_1)
                    } else {
                        self.render_buf = Cow::Borrowed(&IMAGE_SETS
                            .cook_dodge_2)
                    }
                }
            }
        }else{
            self.shuffle_punch_seq();
        }
    }
    pub fn hide_counters(&self){
        if let Some(parent) = self.lpunches_counter_ref.parent_element(){
            log!(parent.dyn_into::<HtmlElement>()).set_hidden(true);
        }
        if let Some(parent) = self.dodges_counter_ref.parent_element(){
            log!(parent.dyn_into::<HtmlElement>()).set_hidden(true);
        }
    }
    pub fn shake_camera(&self){
        spawn_local(shake_camera(self.image_ref.clone()));
    }
    pub fn shuffle_punch_seq(&mut self) {
        self.render_buf = self.temp_render_buf.clone();
        let mut rng = rand::thread_rng();
        let num_punches: usize = if rng.gen::<f64>() < 0.5 { 1 } else { 2 };
    
        let buf_len = self.render_buf.len();
    
        let mut shuffled_indices: Vec<usize> = (1..buf_len).collect();
        shuffled_indices.shuffle(&mut rng);
        shuffled_indices.truncate(num_punches);
    
        let mut shuffled: Vec<&str> = Vec::with_capacity(num_punches);
        for idx in shuffled_indices {
            shuffled.push(self.render_buf[idx]);
        }
        let mut new_buf = Vec::with_capacity(num_punches + 1);
        new_buf.push(self.render_buf[0]);
        new_buf.extend_from_slice(&shuffled);
    
        self.render_buf = Cow::Owned(new_buf);
    }
    pub fn set_frame(&self, path: &str) {
        self.image_ref
            .set_src(&format!("{}/{}", "/assets", path));
    }
    pub fn flip_frame(&self, bool: bool) {
        let s = self.image_ref.style();
        if bool {
            log!(s.set_property("transform", "scaleX(-1)"))
        } else {
            log!(s.set_property("transform", "scaleX(1)"))
        }
    }
    pub async fn cleanup(&mut self) {
        self.flip_frame(false);
        self.hide_counters();
        let winlose = self.npunches > WIN_PUNCHES;
        if winlose {
            match &self.player {
                Characters::ANSEM => {
                    self.set_frame(IMAGE_SETS.result_ansem[1]);
                }
                Characters::COOK => {
                    self.set_frame(IMAGE_SETS.result_cook[1]);
                }
            }
            if self.tier != PunchTiers::T3 {
                self.shake_camera();
                play_sound(&SOUNDS.punch).await;
                self.increment_punch_counter();
            }
            play_sound(&SOUNDS.win).await;
        } else {
            match &self.player {
                Characters::ANSEM => {
                    self.set_frame(IMAGE_SETS.result_ansem[0]);
                }
                Characters::COOK => {
                    self.set_frame(IMAGE_SETS.result_cook[0]);
                }
            }
            self.shake_camera();
            play_sound(&SOUNDS.punch).await;
            play_sound(&SOUNDS.lose).await;
        }
        sleep(Duration::from_millis(10)).await;
        self.set_frame(IMAGE_SETS.default[0]);
    }

    pub async fn render_sequence(&mut self) {
        for i in 0..self.render_buf.len() {
            if FRAMES_TO_NOT_REV.contains(&self.render_buf[i]) {
                self.flip_frame(false);
            } else if let Characters::COOK = self.player {
                self.flip_frame(true);
            }

            if self.image_ref.src() != self.render_buf[i] {
                self.set_frame(&self.render_buf[i]);
            }

            if PLAY_PUNCH_SOUNDS_AT.contains(&self.render_buf[i]) {
                self.shake_camera();
                play_sound(&SOUNDS.punch).await;
                self.increment_punch_counter();
            } else if PLAY_DODGE_SOUND_AT.contains(&self.render_buf[i]) {
                play_sound(&SOUNDS.dodge).await;
                self.increment_dodge_counter();
            } else if PLAY_PWRUP_SOUND_AT.contains(&self.render_buf[i]) {
                play_sound(&SOUNDS.tier3).await
            }

            sleep(Duration::from_millis(300)).await;
        }
    }

    pub fn increment_dodge_counter(&mut self) {
        self.doges += 1;
        self.dodges_counter_ref
            .set_inner_text(&self.doges.to_string())
    }
    pub fn increment_punch_counter(&mut self) {
        self.lpunches += 1;
        self.lpunches_counter_ref
            .set_inner_text(&self.lpunches.to_string());
    }
}
#[wasm_bindgen]
pub async fn render(player: &str, wif: f64) -> usize {
    let mut game = Game::new(player, wif);
    game.dodges_counter_ref.set_inner_text("0");
    game.lpunches_counter_ref.set_inner_text("0");
    spawn_local(play_sound(&SOUNDS.bell));
    for i in 0..game.npunches {
        if game.tier == PunchTiers::T3 && i == game.npunches - 1{
            game.render_buf = mem::replace(&mut game.temp_t3_render_buf, Cow::Owned(Vec::new()));
        }else{
            game.randomize_punch_sequences();
        }
        game.render_sequence().await;
    }
    game.cleanup().await;
    game.lpunches
}
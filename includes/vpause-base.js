/*
* close tab while music playin - icon doesn' change
* */
window.addEventListener('load', function(event) {

    /**
     * http://www.openjs.com/scripts/events/keyboard_shortcuts/
     * Version : 2.01.B
     * By Binny V A
     * License : BSD
     */
    var shortcut = {
        'all_shortcuts':{},//All the shortcuts are stored in this array
        'add': function(shortcut_combination,callback,opt) {
            //Provide a set of default options
            var default_options = {
                'type':'keydown',
                'propagate':false,
                'disable_in_input':false,
                'target':document,
                'keycode':false
            }
            if(!opt) opt = default_options;
            else {
                for(var dfo in default_options) {
                    if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
                }
            }

            var ele = opt.target;
            if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
            var ths = this;
            shortcut_combination = shortcut_combination.toLowerCase();

            //The function to be called at keypress
            var func = function(e) {
                e = e || window.event;

                if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
                    var element;
                    if(e.target) element=e.target;
                    else if(e.srcElement) element=e.srcElement;
                    if(element.nodeType==3) element=element.parentNode;

                    if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
                }

                //Find Which key is pressed
                if (e.keyCode) code = e.keyCode;
                else if (e.which) code = e.which;
                var character = String.fromCharCode(code).toLowerCase();

                if(code == 188) character=","; //If the user presses , when the type is onkeydown
                if(code == 190) character="."; //If the user presses , when the type is onkeydown

                var keys = shortcut_combination.split("+");
                //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
                var kp = 0;

                //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
                var shift_nums = {
                    "`":"~",
                    "1":"!",
                    "2":"@",
                    "3":"#",
                    "4":"$",
                    "5":"%",
                    "6":"^",
                    "7":"&",
                    "8":"*",
                    "9":"(",
                    "0":")",
                    "-":"_",
                    "=":"+",
                    ";":":",
                    "'":"\"",
                    ",":"<",
                    ".":">",
                    "/":"?",
                    "\\":"|"
                }
                //Special Keys - and their codes
                var special_keys = {
                    'esc':27,
                    'escape':27,
                    'tab':9,
                    'space':32,
                    'return':13,
                    'enter':13,
                    'backspace':8,

                    'scrolllock':145,
                    'scroll_lock':145,
                    'scroll':145,
                    'capslock':20,
                    'caps_lock':20,
                    'caps':20,
                    'numlock':144,
                    'num_lock':144,
                    'num':144,

                    'pause':19,
                    'break':19,

                    'insert':45,
                    'home':36,
                    'delete':46,
                    'end':35,

                    'pageup':33,
                    'page_up':33,
                    'pu':33,

                    'pagedown':34,
                    'page_down':34,
                    'pd':34,

                    'left':37,
                    'up':38,
                    'right':39,
                    'down':40,

                    'f1':112,
                    'f2':113,
                    'f3':114,
                    'f4':115,
                    'f5':116,
                    'f6':117,
                    'f7':118,
                    'f8':119,
                    'f9':120,
                    'f10':121,
                    'f11':122,
                    'f12':123
                }

                var modifiers = {
                    shift: { wanted:false, pressed:false},
                    ctrl : { wanted:false, pressed:false},
                    alt  : { wanted:false, pressed:false},
                    meta : { wanted:false, pressed:false}	//Meta is Mac specific
                };

                if(e.ctrlKey)	modifiers.ctrl.pressed = true;
                if(e.shiftKey)	modifiers.shift.pressed = true;
                if(e.altKey)	modifiers.alt.pressed = true;
                if(e.metaKey)   modifiers.meta.pressed = true;

                for(var i=0; k=keys[i],i<keys.length; i++) {
                    //Modifiers
                    if(k == 'ctrl' || k == 'control') {
                        kp++;
                        modifiers.ctrl.wanted = true;

                    } else if(k == 'shift') {
                        kp++;
                        modifiers.shift.wanted = true;

                    } else if(k == 'alt') {
                        kp++;
                        modifiers.alt.wanted = true;
                    } else if(k == 'meta') {
                        kp++;
                        modifiers.meta.wanted = true;
                    } else if(k.length > 1) { //If it is a special key
                        if(special_keys[k] == code) kp++;

                    } else if(opt['keycode']) {
                        if(opt['keycode'] == code) kp++;

                    } else { //The special keys did not match
                        if(character == k) kp++;
                        else {
                            if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
                                character = shift_nums[character];
                                if(character == k) kp++;
                            }
                        }
                    }
                }

                if(kp == keys.length &&
                    modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
                    modifiers.shift.pressed == modifiers.shift.wanted &&
                    modifiers.alt.pressed == modifiers.alt.wanted &&
                    modifiers.meta.pressed == modifiers.meta.wanted) {
                    callback(e);

                    if(!opt['propagate']) { //Stop the event
                        //e.cancelBubble is supported by IE - this will kill the bubbling process.
                        e.cancelBubble = true;
                        e.returnValue = false;

                        //e.stopPropagation works in Firefox.
                        if (e.stopPropagation) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        return false;
                    }
                }
            }
            this.all_shortcuts[shortcut_combination] = {
                'callback':func,
                'target':ele,
                'event': opt['type']
            };
            //Attach the function with the event
            if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
            else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
            else ele['on'+opt['type']] = func;
        },

        //Remove the shortcut - just specify the shortcut and I will remove the binding
        'remove':function(shortcut_combination) {
            shortcut_combination = shortcut_combination.toLowerCase();
            var binding = this.all_shortcuts[shortcut_combination];
            delete(this.all_shortcuts[shortcut_combination])
            if(!binding) return;
            var type = binding['event'];
            var ele = binding['target'];
            var callback = binding['callback'];

            if(ele.detachEvent) ele.detachEvent('on'+type, callback);
            else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
            else ele['on'+type] = false;
        }
    }

    var volStep = 5;
    var plr = window.audioPlayer;
    var hijackTimer;

    var hotkeys = {
        hotkey_tglplay:  "Ctrl+Alt+p",
        hotkey_prev:     "Ctrl+Alt+left",
        hotkey_next:     "Ctrl+Alt+right",
        hotkey_vup:      "Ctrl+Alt+up",
        hotkey_vdown:    "Ctrl+Alt+down",
        hotkey_tglloop:  "Ctrl+Alt+r"
    };

    function sendState() {
        if (plr && plr.player){
            var msg =  plr.player.paused() ? 'paused' : 'playing';
			mes(msg);
        }
    }
    function doPause(){
        if (plr && plr.player){
            plr.pauseTrack();
        }
    }
    function doPlay(){
        if (plr && plr.player){
            plr.playTrack();
        }
    }

    function togglePlay(){
        if (plr && plr.player){
            if(plr.player.paused()){
                plr.playTrack();
            } else {
                plr.pauseTrack();
            }
        }
    }

    function toggleLoop(){
        plr && plr.toggleRepeat()
    }
    function prevTrack(){
        plr && plr.prevTrack()
    }
    function nextTrack(){
        plr && plr.nextTrack()
    }

    function volDown(){
/*        var curVol = parseInt(window.getCookie('audio_vol'));
        var newVol = curVol - volStep;
        if (newVol < 0) {
            newVol = 0;
        }*/
        setVol(-volStep);
    }

    function volUp() {
/*        var curVol = parseInt(window.getCookie('audio_vol'));
        var newVol = curVol + volStep;
        if (newVol > 100) {
            newVol = 100;
        }*/
        setVol(volStep);
    }

    function setVol(delta) {
        if (plr){
            //window.console.log(delta);
            var volLine = window.ge('audio_volume_line'+plr.id);
            if (volLine) {
                var volSliderLeft = window.parseInt(window.ge('audio_vol_slider'+plr.id).style.left);
                var newPxOffset = Math.round(plr.volW / 100 * (volSliderLeft / (plr.volW * 100) + delta));
                var volControlX = window.getXY(volLine)[0] + window.pageXOffset + newPxOffset + 3;

                console.log({

                    delta: delta,
                    "volSliderLeft: ": volSliderLeft,
                    "volSliderLeft / (plr.volW * 100) + delta: ": volSliderLeft / (plr.volW * 100) + delta,
                    "newPxOffset: ": newPxOffset,
                    "window.getXY(volLine)[0]: ": window.getXY(volLine)[0],
                    "window.pageXOffset: ": window.pageXOffset,
                    "volControlX: " : volControlX
                });

                window.ge('gp').style.width = volControlX + "px !important";
                var mdown = window.document.createEvent("MouseEvents");
                mdown.initMouseEvent("mousedown", true, true, window,
                    0, 0, 0, volControlX, 0, false, false, false, false, 0, null);

                var mup = window.document.createEvent("MouseEvents");
                mup.initMouseEvent("mouseup", true, true, window,
                    0, 0, 0, volControlX, 0, false, false, false, false, 0, null);

                volLine.dispatchEvent(mdown);
                volLine.dispatchEvent(mup);

                /*       if(canceled) {
                 // A handler called preventDefault
                 alert("canceled");
                 } else {
                 // None of the handlers called preventDefault
                 alert("not canceled");
                 }*/

            } else {

                var curVol = window.getCookie('audio_vol');
                var newVol = curVol + delta > 100 ? 100 : (curVol + delta < 0 ? 0 : curVol + delta);
                window.console.log(newVol);
                plr.player.setVolume(newVol);
                window.setCookie('audio_vol', newVol, 365);

            }
        }

    }
    function setHotkeys (keys){
        var type = 'keyup';
        for ( var key in keys ) {
            if (key && keys[key]) {
                (function(key){
                    shortcut.add(keys[key], function(e) {
                        mes(key);
                    },{
                        'type': type,
                        'disable_in_input':true,
                        'propagate':true
                    });
                })(key);
            }

        }
    }

    function hijackPlayer (){
        if (plr && !plr.isHijacked){
           plr.setIcon = Function.vPauseAddCallListener( plr.setIcon, {
                success: function(props){
                    var icon = props.args[0];
					if(icon == 'pauseicon' ){
                        mes('justPaused');
                    }
                    else if(icon == 'icon'){
						mes('closedPlayer');
                    }
                    else if(icon == 'playicon'){
						mes('startedPlaying');
                    }
                }
            });
            plr.isHijacked = true;
            if(plr.player && !plr.player.paused()){
                // if it's first run, and play already fired:
				mes('startedPlaying');
            }
            window.clearInterval(hijackTimer);
        }
    }

	function mes(mes){
		opera.extension.postMessage(mes);
	}

    function initVK () {

        hijackTimer = window.setInterval(hijackPlayer, 1000);

        // Execute this when a message is received from the background script.
        opera.extension.onmessage = function(event) {
            switch (event.data) {
                case 'wassup?': sendState();
                    break;
                case 'pauseIt': doPause();
                    break;
                case 'playIt' : doPlay();
                    break;
                case 'prev'   : prevTrack();
                    break;
                case 'next'   : nextTrack();
                    break;
                case 'tglplay': togglePlay();
                    break;
                case 'tglloop': toggleLoop();
                    break;
                case 'vup': volUp();
                    break;
                case 'vdown': volDown();
                    break;
            }
        };

        Function.vPauseAddCallListener = function(func, callbacks) {
            var successNumber = 0,
                errorNumber = 0,
                name = func.name;

            return function() {
                var args = [].slice.call(arguments);
                var result, error;

                var props = {
                    args: args,
                    self: this,
                    name: name
                };
                callbacks.before && callbacks.before(props);

                try {
                    result = func.apply(this, arguments);
                    props.successNumber = ++successNumber;
                    props.result = result;
                    props.status = 'success';
                    callbacks.success && callbacks.success(props);
                } catch (e) {
                    props.errorNumber = ++errorNumber;
                    props.error = e;
                    props.status = 'error';
                    callbacks.error && callbacks.error(props);
                }
                callbacks.after && callbacks.after(props);

                return result;
            }
        };

    }

    function init(){
        setHotkeys(hotkeys);
        if(window.self == window.top && (window.location.host == 'vkontakte.ru' || window.location.host == 'vk.com')){
            initVK();
        }
    }

    init();
/*
	window.setInterval(function(){
		if(plr && plr.player && !plr.player.paused()){
			mes('stillPlaying')
		}
	}, 1000)*/

}, false);

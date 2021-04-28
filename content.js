'use strict';



class googleSearch_key_support{

	constructor(){
		this.per_init();
	}
	
	per_init(){ // before document is loaded
		this.version = 0.00;

		this.Lquad_pointer = 0;
		this.quad_pointer = 0;

		this.input = null;

		this.focus_update = null;
	}

	start(){

		this.body = document.getElementsByTagName('BODY')[0];

		this.start_nullElem();

		this.start_quad_select();
		this.start_keyboard();
		this.start_seatchBar();
	}

	start_nullElem(){
		this.nullElm = document.createElement('DIV');
		this.nullElm.style.display = "none";

		this.body.appendChild(this.nullElm);
	}

	check_records(){
		let pp;
		if((pp = sessionStorage.getItem(window.location.href)) != null){
			return pp;
		}
		return 0;
	}

	get_search_divs(){
		const full_search_divs = document.getElementsByClassName('g');
		console.log(full_search_divs);
		const dict = new WeakMap();
		const array = [];
		let count = 0;

		function process_elem(e){

			const val = dict.get(e);

			if(val === undefined){
				const aux = [e, 0];
				dict.set(e, aux);
				array.push(aux)
				return;
			}

			val[1] += 1;
		}

		for(let i = 0; i < full_search_divs.length; i++){
			const elem = full_search_divs[i];

			if(elem.classList.length === 1){
				process_elem(elem);

			}else{ //classlist.length  > 1
				
				if(elem.classList.contains('kno-kp') || elem.classList.contains('VjDLd')){

					const childs_g = elem.getElementsByClassName('g');
					console.log(childs_g);
	
					for(let k = 0; k < childs_g.length; k++){
						let child = childs_g[k];
						console.log(child);					
						if(child.classList.length === 1){
							process_elem(child);
						}
					}
				}


			}
			
		}

		this.search_divs = new Array();
		array.forEach((x)=>{
			
			if(x[1] === 0)
				this.search_divs.push(x[0]);
		});

		// console.log(a);
		// this.search_divs = Array.from(full_search_divs).filter((e)=>{
		// 	if(e.classList.length === 1)
		// 		return e;
		// });

		/*this.search_divs = array.filter((e)=>{
			if(e[1] === 1)
				return e[0];
		});*/

		console.log(this.search_divs);
		

	}

	start_quad_select(){
		
		this.get_search_divs();

		this.quad_pointer = this.check_records();

		if(this.quad_pointer >= this.search_divs.length)
			 this.quad_pointer = 0;
		

		this.display_on(this.search_divs[this.quad_pointer]);
		
		this.refresh_quads();

	}
	display_on(quad){
		quad.style.border = "4px dotted blue";
	}

	display_off(quad){
		quad.style.border = "none";
	}

	up_pointer(){
		this.quad_pointer++;
		if(this.quad_pointer >= this.search_divs.length)
			this.quad_pointer = this.search_divs.length - 1;

		this.refresh_quads();
	}

	down_pointer(){
		this.quad_pointer--;
		if(this.quad_pointer < 0)
			this.quad_pointer = 0;

		this.refresh_quads();
	}

	refresh_quads(){
		if(this.quad_pointer ===  this.Lquad_pointer)
			return;

		this.display_off(this.search_divs[this.Lquad_pointer]);
		this.display_on(this.search_divs[this.quad_pointer]);

		this.Lquad_pointer = this.quad_pointer;
		this.set_focus(this.search_divs[this.quad_pointer]);
		
	}

	run_focus(){
		const margin = 25;
		this.focus_update = setInterval(() => {

			window.scroll(window.scrollX, window.scrollY + (this.go_scrollY - window.scrollY)*0.50)+10;

			if(window.scrollY <= this.go_scrollY + margin && window.scrollY >= this.go_scrollY - margin){
				clearInterval(this.focus_update);
				this.focus_update = null;
			}
		}, 20);
	}

	set_focus(elem){	
		this.go_scrollY = elem.getBoundingClientRect().top - window.innerHeight/2+ window.pageYOffset;
	
		if(this.focus_update == null)
			this.run_focus();
	}

	enter_quad_link(){
		const href = this.search_divs[this.quad_pointer].getElementsByTagName('A')[0];
		sessionStorage.setItem(window.location.href, this.quad_pointer);

		window.open(href.href, "_self")
	}

	start_seatchBar(){
		this.input = document.getElementsByTagName('INPUT')[0];

		//this is here, cause general keydown event doesnt capture Escape key, when its focus to input
		this.input.addEventListener("keydown", (event)=>{
			switch(event.key){
				case "Escape":
					this.input.blur();
				break;
			}
		});
	}

	focus_searchBar(){
		
			
		if(this.input == null){

			return 0;
		}

		this.input.focus();

		if(this.input.getBoundingClientRect().top < 0){
			window.scroll(window.scrollX, window.pageYOffset + this.input.scrollY);
		}
		const ch_len = this.input.value.length;
		this.input.setSelectionRange(ch_len, ch_len);

	}

	unfocus_searchbar(){
		if(this.input !== null){
			this.nullElm.click();
		}
	}

	open_link_of_id(id){
		const elem = document.getElementById(id);
		if(elem !== null){
			window.open( elem.href, "_self");
		}
	}

	start_keyboard(){
		document.addEventListener('keydown', (event) => {
			console.log(event.key);
			const key = event.key;

			switch(key){
				case "ArrowDown":
					this.up_pointer();
				break;
				case "ArrowUp":
					this.down_pointer();
				break;
				case "Enter":
					this.enter_quad_link();
				break;
				case "/":
					if(document.activeElement !== this.input)
						event.preventDefault();	
					
					this.focus_searchBar();
				break;
				case "Escape":
					this.unfocus_searchbar();
				break;
				case "ArrowRight":
					if(event.ctrlKey && document.activeElement !== this.input){
						this.open_link_of_id("pnnext");
					}
				break;
				case "ArrowLeft":
					if(event.ctrlKey &&  document.activeElement !== this.input){
						this.open_link_of_id("pnprev");
					}
				break;
					
			}
		
		});
	}
}



window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

//-------------------------------------
const prog = new googleSearch_key_support();

window.addEventListener("load", ()=>{
	prog.start();

});




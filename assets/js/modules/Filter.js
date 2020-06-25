import {Flipper, spring} from 'flip-toolkit'

/**
 * @property {HTMLElement} pagination
 * @property {HTMLElement} content
 * @property {HTMLElement} sorting
 * @property {HTMLFormElement} form
 */
export default class Filter {

    /**
     * 
     * @param {HTMLElement|null} element 
     */
    constructor(element) {
        if(element === null) {
            return
        }
        this.pagination = element.querySelector('.js-filter-pagination')
        this.content = element.querySelector('.js-filter-content')
        this.sorting = element.querySelector('.js-filter-sorting')
        this.form = element.querySelector('.js-filter-form')
        this.bindEvents()
    }

    /**
     * Ajoute les comportements aux différents éléments
     */
    bindEvents(){

        const aClickListener = (e) => {
            if (e.target.tagName === "A") {
                e.preventDefault(); //pour enlever le comportement par défaut
                this.loadUrl(e.target.getAttribute("href"));
            }
        };

        this.sorting.addEventListener("click", aClickListener);
        this.pagination.addEventListener("click", aClickListener);
        //selection que des checkbox
        //this.form.querySelectorAll('input[type=checkbox]').forEach(input => {
        //maintenant en fonction de l'input ; pour prendre en compte les checkbox et le slider
        this.form.querySelectorAll('input').forEach(input => {
            input.addEventListener("change", this.loadForm.bind(this))
        })
    }

    async loadForm() {
        const data = new FormData(this.form) //on recupère les données du formulaire
        const url = new URL(this.form.getAttribute('action') || window.location.href)
        const params = new URLSearchParams()
        data.forEach((value, key) => {
            params.append(key, value)
        })
        return this.loadUrl(url.pathname + '?' + params.toString())
    }

    async loadUrl(url) {
        const ajaxUrl = url + '&ajax=1'
        const response  = await fetch(ajaxUrl, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        if(response.status >= 200 && response.status < 300) {
            const data = await response.json()
            //this.content.innerHTML = data.content //affichage des produits
            //on affiche les produits en faisant appel a flip toolkit
            this.flipContent(data.content)
            this.sorting.innerHTML = data.sorting //affichage des boutons
            history.replaceState({},'',url) // pour l'historique de l'url
            this.pagination.innerHTML = data.pagination
        } else {
            console.error(response)
        }
    }

    /**
     * Remplace les éléments de la grille par un effet d'animation flip
     * @param {string} content 
     */
    flipContent(content) {
        const springConfig = 'gentle'
        //on va gerer l'effet ressort lors du chargement
        const exitSpring = function (element, index, onComplete) {
            spring({
                config: 'stiff',
                values: {
                    translateY: [0, -20],
                    opacity: [1, 0],
                },
                onUpdate: ({ translateY, opacity }) => {
                    element.style.opacity = opacity;
                    element.style.transform = `translateY(${translateY}px)`;
                },
                onComplete,
            });
        };

        const flipper = new Flipper({
            element: this.content
        })
        this.content.children.forEach(element => {
            flipper.addFlipped({
                element,
                spring: springConfig,
                flipId: element.id,
                shouldFlip: false,
                onExit: exitSpring
            });
        })
        flipper.recordBeforeUpdate(); // on memorisation la position de tous mes éléments que j'ai renseigné
        this.content.innerHTML = content;
        // //je reboucle pour recréer des flippers pou qu'il trouve la positions de mes nouveaux éléments
        this.content.children.forEach(element => {
            flipper.addFlipped({
                element,
                spring: springConfig,
                flipId: element.id
            })
        })
        flipper.update()
        //this.content.innerHTML = content
    }
}
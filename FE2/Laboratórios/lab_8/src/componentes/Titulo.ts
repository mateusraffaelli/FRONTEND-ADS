import { criarElemento } from "../util/ui.js";

class Titulo {

    private _elemento: HTMLHeadingElement;

    constructor(nivel: number, texto: string){
        this._elemento = criarElemento(`h${nivel}`, texto) as HTMLHeadingElement;
    }

    get elemento(){
        return this._elemento;
    }
    
}

export default Titulo;
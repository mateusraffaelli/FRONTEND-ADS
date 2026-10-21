function encontrarMaiorElemento (numeros){
    
    return numeros.reduce((maior, numero) => numero > maior ? numero : maior)  
     
}

export{encontrarMaiorElemento}
const formatarPalavrasLongas = (listaStrings) => {
    const palavrasLongas = listaStrings.filter(x => x.length > 5)
    const palavrasEmMaiusculo = palavrasLongas.map(x => x.toUpperCase())
   return palavrasEmMaiusculo
}

export{formatarPalavrasLongas}
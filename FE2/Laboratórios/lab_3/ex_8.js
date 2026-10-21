const posicaoFibonacci = () => {
    let cache = {}
    return function fibonacci(n) {
        if (n in cache) {
            return cache[n];
        }
        if (n === 0){
            cache[n] = 0 
            return cache[n];
        }
        if(n === 1){
            cache[n] = 1 
            return cache[n];
        }

        cache[n] = fibonacci(n -1) + fibonacci(n-2);
        return cache[n];
  };
}



export{posicaoFibonacci}
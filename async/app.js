require('babel-register')

console.log('debut')

new Promise( (resolve, reject) => {

    setTimeout( () => {

        resolve('ok no problem')
        //reject(new Error('Rrrrrr error'))
    })
})
.then(message => console.log(message))
.catch(err => console.log(err.message))

console.log('fin')

const getDiscount = (month) =>{
    money = 1000
    let result = month
    if(month >= 6 && month < 12){
        result =   money*10%
    }else if(month >= 12 && month <= 24){
        result = money*20%
    }else if(month >24){
        result = money*30%
    }

    return result
}

console.log(getDiscount(10));
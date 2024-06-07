const getMonthDiscount = (month) =>{
    let result = month
    if(month >= 6 && month < 12){
        result = month -1 ;
    }else if(month >= 12 && month <= 24){
        result = month - 2;
    }else if(month >24){
        result = month -4;
    }

    return result
}

console.log(getMonthDiscount(21));
let getDays = function(pText) {
  let days = null ;
  let isValid = false;
  let bdate = null;
  var today = new Date();
  let t = pText.match(/^(\d{4})\-(\d{2})\-(\d{2})$/);
  if (t !== null) {
      let y = +t[1], m = +t[2], d = +t[3];
      bdate = new Date(y, m - 1, d);

      isValid = (bdate.getFullYear() === y && bdate.getMonth() === m - 1) ;
  }
  if(isValid){
    bdate.setFullYear(today.getFullYear());
    if (today > bdate) {
      bdate.setFullYear(today.getFullYear() + 1);
    }    
    days = Math.floor((bdate - today) / (1000*60*60*24))+1;
  }
  return days ;
}

module.exports = getDays;
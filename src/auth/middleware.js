/**
 * Created by apple on 20/06/17.
 */
export default function() {
  const userCheck = sessionStorage.getItem('token');
  console.log(userCheck);
  if(userCheck === null){
    sessionStorage.clear();
    window.location.href = '/';
  }
}
/**
 * Created by apple on 20/06/17.
 */
export default function() {
  const userCheck = sessionStorage.getItem('token');
  if(userCheck === null){
    sessionStorage.clear();
    window.location.href = '/';
  }
}
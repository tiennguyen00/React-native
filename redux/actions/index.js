
export function fetchUser(){
    return((dispatch) => {
        fetch('http://192.168.1.5:3000/get-data-users')
        .then(response => response.json())
        .then(data => {
            console.log("Data from fetch:", data);
            dispatch({type: "GET_DATA_USER", currentUser: data})
        })
    })
}
export default {
    getAllRecipes: async function() {
        fetch('api/recipes', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            return data
        })
    },
    delete: async function(unique_id) {
        console.log(unique_id)
        const id = JSON.stringify(unique_id)
        fetch('api/delete/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },  
            body: {
                unique_id: id
            }
        })
    }
    
}


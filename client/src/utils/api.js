const api = {
    getAllRecipes: function() {
        fetch('api/recipes', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            return data
        })
    },

    
}

export default api
function Recipes()  {
    const me = {};

    me.refreshRecipes = async function() {
        // Fetch and display recipes
        const res = await fetch('/api/recipes');
        if (!res.ok) {
            console.error('Failed to fetch recipes', res.status, res.statusText);
            document.getElementsByTagName('main')[0].innerHTML = '<p>Error loading recipes. Please try again later.</p>';
            return;
        }
    };
    return me;
};

export default Recipes;
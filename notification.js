function removeItem() {
  
    const ul = document.getElementById('notification');
    
    const items = ul.getElementsByTagName('li');
    
    if(items.length > 0) {
      items[0].remove();
    }
}
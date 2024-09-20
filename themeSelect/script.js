document.querySelector('#btn-1').addEventListener('click', () => {
    document.querySelector('body').style.backgroundImage = 'none';
    document.querySelector('body').style.backgroundColor = 'black';
    document.querySelector('body').style.color = 'white';
});

document.querySelector('#btn-2').addEventListener('click', () => {
    document.querySelector('body').style.backgroundImage = 'none';
    document.querySelector('body').style.backgroundColor = 'white';
    document.querySelector('body').style.color = 'black';
});

document.querySelector('#btn-3').addEventListener('click', () => {
    document.querySelector('body').style.backgroundImage = 'none';
    document.querySelector('body').style.backgroundColor = '#232b2b';
    document.querySelector('body').style.color = 'white';
});

document.querySelector('#btn-4').addEventListener('click',()=>{
    document.querySelector('body').style.backgroundImage = 'linear-gradient(120deg, #de54a4 0%, #794cc2 50%, #632cba 100%)';
    document.querySelector('body').style.color = 'white';
});

"use strict";

(function(){
    const   addImgBtn = document.querySelector("#add-img"),
            resultBlock = document.querySelector('#result'),
            sortBlock = document.querySelector("#type-selector"),
            counter = document.querySelector('#counter'),
            backCounter = document.querySelector('#back-counter'),
            modal = document.querySelector("#myModal");
    let     imageCounter = 0,
            readyDataForGallery = [], //массив подготовленных эл-в
            visibleData = [], //массив эл-в, которые есть на экране
            deletedData = []; //массив удаленных эл-в
            
    let ready = () => {
        sortBlock.value = localStorage.sortMethod ? localStorage.sortMethod : "0";
        readyDataForGallery = data.map((item, index) => {                 //creating array after loading
            return {
                    url: urlFomat(item.url),
                    name: nameFormat(item.name),
                    description: descriptionFormat(item.description),
                    date: dateFormat(item.date),
                    id: "img_" + index
                    }
        });
    }
  
    let nameFormat = (name) => {
        return  name ? name[0].toUpperCase() + name.substring(1).toLowerCase() : "Lohn Doh";
    };
    let urlFomat =  (url) => {
        return  url.indexOf("http://") === -1 ? `http://${url}` :  url; 
    };
    let descriptionFormat = (descr) => {
        return (descr.length > 15 ) ? descr.substring(0 , 15) + "..." : descr;
    };
    let dateFormat = (date) => {
        let format = "YYYY/MM/DD HH:mm";
        return  (!date.isNaN) ? moment(date).format(format) : console.log("Error, data is incorrect") ;
    };
    let print = (data) => {
        console.log(data);
    };

    let galleryItem = (item, index) => {
        return `<div class="col-md-3 col-xs-6 gallery-item" id = "${item.id}">
                    <img src="${item.url}" alt="${item.name}" class="img-thumbnail">
                    <div class="info-wrapper">
                        <div class="text-muted item-name">${index}: ${item.name}</div>
                        <div class="text-muted top-padding">${item.description}</div>
                        <div class="text-muted">${item.date}</div>
                    </div>
                    <div  id = "delete-img" class = "btn btn-danger" title = "Удалить данное изображение"> Удалить </div>
                </div>`;
    };

    let reBuildGallery = (array) => {
        resultBlock.innerHTML = "";
        for (let i = 0; i < array.length; i++) {
                resultBlock.innerHTML += galleryItem(array[i], i+1);
        }
        imageCounter = array.length;
        counter.innerHTML = imageCounter;
        backCounter.innerHTML = readyDataForGallery.length - imageCounter;
    };


//*************************LISTENERS*************************************************************

    let initListeners = () => {
        document.addEventListener("DOMContentLoaded", ready);
        addImgBtn.addEventListener("click", addImage);
        addImgBtn.addEventListener("click", sortGallery);
        resultBlock.addEventListener("click", deleteImage);
        sortBlock.addEventListener("change", sortGallery);
    }

//***************************************************SORTGALLERY*********************************************

    let sortNameAz = (a , b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
    };
    let sortNameZa = (a , b) => {
        if(a.name < b.name) return 1;
        if(a.name > b.name) return -1;
        return 0;
    };
    let sortDateAz = (a , b) => {
        if(a.date < b.date) return -1;
        if(a.date > b.date) return 1;
        return 0;
    };
    let sortDateZa = (a , b) => {
        if(a.date < b.date) return 1;
        if(a.date > b.date) return -1;
        return 0;
    };

    let sortGallery = () => {
        let method;
        switch (sortBlock.value) {
            case "0":
                method = sortNameAz;
                localStorage.setItem('sortMethod', '0');
                break;
            case "1":
                method = sortNameAz;
                localStorage.setItem('sortMethod', '1');
                break;
            case "2":
                method = sortNameZa;
                localStorage.setItem('sortMethod', '2');
                break;
            case "3":
                method = sortDateAz;
                localStorage.setItem('sortMethod', '3');
                break;
            case "4":
                method = sortDateZa;
                localStorage.setItem('sortMethod', '4');
                break;
        }
        visibleData.sort(method);
        reBuildGallery(visibleData);
    };

//**********************************DELETEIMAGE**********************************************

    let findIndexWithId = (id, array) => {
        let temp;
        array.forEach( elem => {
            if(elem.id === id) {
                temp = array.indexOf(elem);
            }
        })
        return temp;
    };

    let  deleteImage = (event) => {
        let tempId,
          deletedItem,
          target = event.target;
        
          if (target.id == "delete-img"){
            tempId = target.closest(".gallery-item").id;
            deletedItem = visibleData[findIndexWithId(tempId, visibleData)];
            deletedData.push(deletedItem);
            visibleData.splice(visibleData.indexOf(deletedItem), 1);
            addImgBtn.disabled = false;
            addImgBtn.style.backgroundColor = "#286090";
            reBuildGallery(visibleData);
        }
    };

  //**************************************addimage********************************************************

    let  addImage = () => {
        if (deletedData.length == 0) {
            for (let item of readyDataForGallery) {
                if(visibleData.indexOf(item) === -1 ) {
                    visibleData.push(item);
                    break;
                }
            }
        }
        if (deletedData.length !== 0) {
            let temp;
            temp = deletedData.pop();
            visibleData.push(temp);
        }
        if (imageCounter >= 9) {
            addImgBtn.setAttribute("data-toggle" , "modal");
            addImgBtn.setAttribute("data-target" , "#myModal");
        }
        if (imageCounter < 9) {
            addImgBtn.removeAttribute("data-toggle" , "modal");        
            addImgBtn.removeAttribute("data-target" , "#myModal");
        }
        if (imageCounter === 10) {
            addImgBtn.disabled = true;
            addImgBtn.style.backgroundColor = "grey";
        }
    };
    
    initListeners();

})();


/*
2 не до конца получилось реализовать окно с помощью modal  , строки  173-183 (как то не смог докрутить, подскажите как правильно.)  +-



/*Вопрос1: вместо <div  id = "delete-img"... у меня раньше создавалась <form> <button id = "delete-img">...,
           но когда я нажимал на кнопку удалить - удалялись все изображения и дебагер не отслеживал событие.
           с чем это связано? с поведением формы?
*/




"use strict";

(function(){
    const   addImgBtn = document.querySelector("#add-img"),
            resultBlock = document.querySelector('#result'),
            sortBlock = document.querySelector("#type-selector"),
            counter = document.querySelector('#counter'),
            backCounter = document.querySelector('#back-counter'),
            modal = document.querySelector("#myModal"),
            cardsLimit = 10;
    let     imageCounter = 0,
            readyDataForGallery = [], //массив подготовленных эл-в
            visibleData = [], //массив эл-в, которые есть на экране
            deletedData = []; //массив удаленных эл-в
            
    let ready = () => {
        sortBlock.value = localStorage.sortMethod ? localStorage.sortMethod : "0";
        readyDataForGallery = data.map((item, index) => {                 //creating array after loading
            return {
                    url: item.url,
                    name: item.name,
                    description: item.description,
                    date: item.date,
                    id: "card_" + index
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
                    <img src="${urlFomat(item.url)}" alt="${nameFormat(item.name)}" class="img-thumbnail">
                    <div class="info-wrapper">
                        <div class="text-muted item-name">${index}: ${nameFormat(item.name)}</div>
                        <div class="text-muted top-padding">${descriptionFormat(item.description)}</div>
                        <div class="text-muted">${dateFormat(item.date)}</div>
                    </div>
                    <div  name = "delete-img" class = "btn btn-danger" title = "Удалить данное изображение"> Удалить </div>
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
        checkLimit(); 
    };
//*******************************LISTENERS*************************************************************
    let initListeners = () => {
        document.addEventListener("DOMContentLoaded", ready);
        addImgBtn.addEventListener("click", addImage);
        resultBlock.addEventListener("click", deleteImage);
        sortBlock.addEventListener("change", sortGallery);
    }
//*****************************SORTGALLERY*********************************************

    let sortGallery = () => {
        switch (sortBlock.value) {
            case "0":
                visibleData.sort((a , b) => (a.name > b.name));
                localStorage.setItem('sortMethod', '0');
                break;
            case "1":
                visibleData.sort((a , b) => (a.name > b.name));
                localStorage.setItem('sortMethod', '1');
                break;
            case "2":
            visibleData.sort((a , b) => (a.name < b.name));
                localStorage.setItem('sortMethod', '2');
                break;
            case "3":
                visibleData.sort((a , b) => (a.date < b.date));
                localStorage.setItem('sortMethod', '3');
                break;
            case "4":
                visibleData.sort((a , b) => (a.date > b.date));
                localStorage.setItem('sortMethod', '4');
                break;
        }
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
        
          if (target.classList.contains("btn-danger")){
            tempId = target.closest(".gallery-item").id;
            deletedItem = visibleData[findIndexWithId(tempId, visibleData)];
            deletedData.push(deletedItem);
            visibleData.splice(visibleData.indexOf(deletedItem), 1);
            addImgBtn.disabled = false;
            
            reBuildGallery(visibleData);
            checkLimit();
        }
    };
//********************************************************************************************* 
    let checkLimit = () => {
        if (imageCounter < cardsLimit) {
            addImgBtn.removeAttribute( "disabled");
            addImgBtn.style.backgroundColor = "#337ab7";
            addImgBtn.removeAttribute("data-toggle");
        }
        if (imageCounter === cardsLimit) {
             addImgBtn.setAttribute( "disabled", "true");
             addImgBtn.style.backgroundColor = "grey";
             addImgBtn.setAttribute("data-toggle", "modal");
         }
        
    }
    let prepearDataToAdd = () => {
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
    }
  //**************************************addimage********************************************************
    let  addImage = () => {
        prepearDataToAdd();
        sortGallery();
    };

    initListeners();

}());

  

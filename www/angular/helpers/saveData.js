var kubeAdmin = angular.module('kubeApp');

kubeAdmin.factory('SaveData', function(){

    var myData = [];

    this.addFolder = function(name){
        var newFolder = new Folder(name);
        myData.push(newFolder);
        return newFolder;
    };

    this.getOrCreate = function(name){
        var folder = this.get(name);
        return (folder !=  null) ? folder : this.addFolder(name);
    };

    this.removeFolder = function(name,force){
        force = force || false;
        for(var i=0; i<myData.length; i++){
            if(myData[i].name == name){
                myData.splice(i,1);
                if(force){
                    localStorage.removeItem(name);
                }
                return true;
            }
        }

        var item = localStorage.getItem(name);
        if(item !=null && force){
            localStorage.removeItem(name);
            return true;
        }

        return false;
    };

    this.get = function(name,force){
        force = force || false;
        for(var i=0; i<myData.length; i++){
            if(myData[i].name == name){
                return  myData[i];
            }
        }

        if(force){
            var item = localStorage.getItem(name);
            if(item !== null){
                var json = JSON.parse(item);

                var f = this.addFolder(name);
                for (var i = 0; i < json.length; i++) {
                    var current = json[i];
                    
                    f.addInfo(current.key,current.value);
                }
                return f;
            }
        }

        return null;
    };

    var Info = function(key,value){
        this.key = key;
        this.value = value;
    };

    var Folder = function(name){
        this.name = name;
        this.myData = new Array();

        this.toString = function(){
            var text = '';
            for(var i=0; i<this.myData.length; i++){
                text+= '"'+this.myData[i].key+'" : '+this.myData[i].value+"\n";
            }
            return text;
        };

        this.addInfo = function(key, value){
            var newData = new Info(key,value);
            this.myData.push(newData);
            return true;
        };

        this.addInfoOrUpdate = function(key,value){
            var info = this.get(key);
            if(info !== null){
                info.value = value;
                return true;
            }else{
                return this.addInfo(key, value);
            }
        };

        this.deleteContent = function(){
            this.myData = new Array();
        };

        this.removeInfo = function(key){
            for(var i=0; i<myData.length; i++){
                if(this.myData[i].key == key){
                    this.myData.splice(i,1);
                    return true;
                }
            }
            return false;
        };

        this.find = function(key,ignoreCase){
            var ignoreCase = ignoreCase || true;
            for(var i=0; i<this.myData.length; i++){
                var dataKey = (ignoreCase) ? this.myData[i].key.toLowerCase() : this.myData[i];
                var key = (ignoreCase) ? key.toLowerCase() : key;
                if(key ==  dataKey){
                    return true;
                }
            }
            return false;
        };

        this.get = function(key,ignoreCase){
            var ignoreCase = ignoreCase || true;
            for(var i=0; i<this.myData.length; i++) {
                var dataKey = (ignoreCase) ? this.myData[i].key.toLowerCase() : this.myData[i];
                var key = (ignoreCase) ? key.toLowerCase() : key;
                if(dataKey == key){
                    return this.myData[i];
                }

            }
            return null;
        };

        this._ = function(key, ignoreCase){
            return this.get(key,ignoreCase);
        };

        this.erase = function(){
            localStorage.removeItem(this.name);
            return true;
        };

        this.store = function(keys){
            keys = keys || null;
            var obj;
            if(keys == null){
                localStorage.setItem(this.name,JSON.stringify(this.myData));
                return true;
            }

            if(typeof keys == "object"){

                obj = new Array();

                for(var i=0; i<this.myData.length; i++){
                    var key = this.myData[i].key;
                    for(var j=0; j<keys.length; j++) {
                        if(key == keys[j]) {
                            var finded = this._(key);
                            if(finded !=  null){
                                obj.push(finded);
                            }
                        }
                    }
                }

                if(obj.length == 0){
                    console.error("error keys not found");
                    return false;
                }

                localStorage.setItem(this.name,JSON.stringify(obj));
                return true;

            }else{
                obj = this._(keys);
                if(obj != null){
                    localStorage.setItem(this.name,JSON.stringify(obj));
                    return true;
                }
                console.error("key not found");
                return false;
            }
        };

    }; //fin  de la clase folder

    return this;
});
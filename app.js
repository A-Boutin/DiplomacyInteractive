var map = document.querySelector('#map')
var paths = map.querySelectorAll('.map__image a')
var links = map.querySelectorAll('.map__list a')
var great_power_list = map.querySelectorAll('.map__list h3')
var unitCircles = map.querySelectorAll('.map__image circle')

var allPoints = new Map();
var adjacentProvincesList = new Map();
console.log(adjacentProvincesList);

function AllPoints(){  
    paths.forEach(function (path) {
        var path_name = path.id
        var path_points = path.querySelectorAll('path')
        var province_points = "";
        path_points.forEach(function (points) {
            province_points += " "+points.getAttribute('d').replace(/[A-Za-z\n]/g, '')
        })
        allPoints.set(path_name, province_points.trim().split(" "));
    })

    allPoints.forEach((point, place)=> {
        var isNextToArr = new Array();
        allPoints.forEach((comparing_point, comparing_place)=> {
            if(place!=comparing_place){
                ProvinceCheck:
                for(var i=0; i < point.length; i++){
                    for(var j=0; j < comparing_point.length; j++){
                        if(point[i]  === comparing_point[j]){
                            isNextToArr.push(comparing_place);
                            break ProvinceCheck;
                        }
                    }
                }
            }
        })
        adjacentProvincesList.set(place, isNextToArr)
    })
    //console.log(adjacentProvincesList)
}
AllPoints();

function AllPathPoints(){
    var allPathPoints = new Map()
    paths.forEach(function (path) {
        var path_points = path.querySelectorAll('path')
        path_points.forEach(function (points) {
            var province_points = points.getAttribute('d').replace(/[A-Za-z\n]/g, '')
            allPathPoints.set(points.id, province_points.trim().split(" "));
        })
    })
    return allPathPoints;
}

// Polyfill for foreach
if(NodeList.prototype.forEach === undefined){
    NodeList.prototype.forEach = function (callback) {
        [].forEach.call(this, callback)
    }
}

function openCloseForm(){
    var forms = document.getElementById("Forms");
    if(forms.style.width == "600px"){
        document.getElementById("Forms").style.width="0px";
        document.getElementById("FormsOpenClose").style.marginLeft="0px";
    }
    else{
        document.getElementById("Forms").style.width="600px";
        document.getElementById("FormsOpenClose").style.marginLeft="602px";
    }
}

function openCloseList(){
    var menu = document.getElementById("menu");
    if(menu.style.width == "300px"){
        document.getElementById("menu").style.width="0px";
        document.getElementById("mainbox").style.marginRight="5px";
        document.getElementById("errorMessage").style.marginRight="30px";
    }
    else{
        document.getElementById("menu").style.width="300px";
        document.getElementById("mainbox").style.marginRight="300px";
        document.getElementById("errorMessage").style.marginRight="325px";
    }
}

var radios = document.getElementsByTagName('input');
for(i=0; i<radios.length; i++ ) {
    radios[i].onclick = function(e) {
        if(e.ctrlKey || e.metaKey) {
            this.checked = false;
        }
    }
}

var activeArea = function (id) {
    map.querySelectorAll('.is-active').forEach(function (item) {
        item.classList.remove('is-active')
    })
    map.querySelectorAll('.is-adjacent-active').forEach(function (item) {
        item.classList.remove('is-adjacent-active')
    })
    if(id !== undefined){
        if(id != "Switzerland"){
            if(document.querySelector('#list-' + id).classList != null || document.querySelector('#' + id).classList != null){
                document.querySelector('#list-' + id).classList.add('is-active')
                document.querySelector('#' + id).classList.add('is-active')
                // document.querySelector('#'+id).children[0].classList.add('is-active')
            }
        }
    }
    
    activeAdjacentAreas(id)
}

var activeAdjacentAreas = function (id) {
    if(id != "Switzerland"){
        if(adjacentProvincesList.get(id) !== undefined){
            adjacentProvincesList.get(id).forEach(adjacentProvince=>{
                if(adjacentProvince !== undefined){
                    if(adjacentProvince != "Switzerland"){
                        if(document.querySelector('#list-' + adjacentProvince).classList !== null || document.querySelector('#' + adjacentProvince).classList !== null){
                            document.querySelector('#list-' + adjacentProvince).classList.add('is-adjacent-active')
                            document.querySelector('#' + adjacentProvince).classList.add('is-adjacent-active')
                        }
                    }
                }
            })
        }
    }
}

var activeArmyArea = function (id) {
    map.querySelectorAll('.is-active').forEach(function (item) {
        item.classList.remove('is-active')
    })
    map.querySelectorAll('.is-adjacent-active').forEach(function (item) {
        item.classList.remove('is-adjacent-active')
    })
    if(id !== undefined){
        if(id != "Switzerland"){
            if(!document.getElementById(id).children[0].classList.contains("w")){
                if(document.querySelector('#list-' + id).classList != null || document.querySelector('#' + id).classList != null){
                    document.querySelector('#list-' + id).classList.add('is-active')
                    document.querySelector('#' + id).classList.add('is-active')
                    activeArmyAdjacentAreas(id);
                }
            }
        }
    }
}

var activeArmyAdjacentAreas = function (id) {
    if(id != "Switzerland"){
        var adjacentAreaList = getArmyAreaAdjacents(id);
        adjacentAreaList.forEach(function (adjacentArea) {
            if(document.querySelector('#' + adjacentArea).classList !== null){
                document.getElementById(adjacentArea).classList.add('is-adjacent-active')
            }
        })
    }
}

//MAKE IT SO IT DOESN'T GIVE is-active IF YOU CAN'T PLACE UNIT ON IT
var activeFleetPath = function (id) {
    map.querySelectorAll('.is-active').forEach(function (item) {
        item.classList.remove('is-active')
    })
    map.querySelectorAll('.is-adjacent-active').forEach(function (item) {
        item.classList.remove('is-adjacent-active')
    })
    if(id !== undefined){
        if(id != "Switzerland" || id != "Swi"){
            if(document.querySelector('#list-' + id).classList != null || document.querySelector('#' + id).classList != null){
                document.querySelector('#list-' + id).classList.add('is-active')
                var currHoveredProvince;
                paths.forEach(function (path) {
                    var children = Array.from(path.children);
                    children.forEach(function (child) {
                        child.addEventListener('mouseenter', function (e) {
                            if(document.getElementById(child.id).classList != null){
                                currHoveredProvince = child.id;
                                document.getElementById(currHoveredProvince).classList.add('is-active')
                                activeFleetAdjacentPaths(currHoveredProvince)
                            }
                        })
                    })
                })
            }
        }
    }
}

var activeFleetAdjacentPaths = function (id) {
    if(id != "Switzerland"){
        var adjacentPathList = getFleetPathAdjacents(id);
        adjacentPathList.forEach(function (adjacentPath) {
            if(document.querySelector('#' + adjacentPath).classList !== null){
                document.getElementById(adjacentPath).classList.add('is-adjacent-active')
            }
        })
    }
}

var currClickedProvince;
paths.forEach(function (path) {
    var children = Array.from(path.children);
    children.forEach(function (child) {
        child.addEventListener('click', function (e) {
            currClickedProvince = child.id;
        })
    })
})

paths.forEach(function (path) {
    path.addEventListener('mouseenter', function (e) {
        var id = this.id

        var unit_type = getUnitCheckValue();
        if(unit_type == "Fleet"){
            activeFleetPath(id);
        }
        else if(unit_type == "Army"){
            activeArmyArea(id)
        }else{
            activeArea(id)
        }

        //drawCircle(id)
    })
    path.addEventListener('click', function (e) {
        var id = this.id
        addRadio()
        if(addChecked){
            drawCircle(id)
        }
    })
})

links.forEach(function (link) {
    link.addEventListener('mouseenter', function () {
        var id = this.id.replace('list-', '')
        activeArea(id)
    })
})

great_power_list.forEach(function (great_power) {
    great_power.addEventListener('mouseenter', function () {
        map.querySelectorAll('.is-active').forEach(function (item) {
            item.classList.remove('is-active')
        })
        map.querySelectorAll('.is-adjacent-active').forEach(function (item) {
            item.classList.remove('is-adjacent-active')
        })
        map.querySelectorAll('.'+great_power.innerText).forEach(function (item) {
            paths.forEach(function (path) {
                if(path.classList.contains(great_power.innerText)){
                    var paths_of_province = path.getElementsByTagName("path");
                    for(var i=0; i< paths_of_province.length; i++){
                        paths_of_province[i].classList.add(great_power.innerText);
                    }
                }
            })
        })
    })
    great_power.addEventListener('mouseleave', function () {
        map.querySelectorAll('.'+great_power.innerText).forEach(function (item) {
            paths.forEach(function (path) {
                if(path.classList.contains(great_power.innerText)){
                    var paths_of_province = path.getElementsByTagName("path");
                    for(var i=0; i< paths_of_province.length; i++){
                        paths_of_province[i].classList.remove(great_power.innerText);
                    }
                }
            })
        })
    })
})

map.addEventListener('mouseover', function () {
    activeArea()
})

var units = new Map();
function drawCircle(province, type = null, great_power = null, coast = currClickedProvince){
    type = getUnitCheckValue();
    if(type != null){
        great_power = getGreatPowerValue();
        if(great_power != null){
            var hasUnit = false;
            units.forEach(function (value, key) {
                if(value.Location == province){
                    hasUnit = true;
                }
            })
            if(!hasUnit){
                if(province != "Switzerland"){
                    if(type == "Army"){
                        var isLocToOnLand = false;
                        for(var i=0; i < paths.length; i++){
                            if(paths[i].id == province){
                                for(var j=0; j < paths[i].children.length; j++){
                                    if(paths[i].children[j].classList.contains("l")){
                                        isLocToOnLand = true;
                                    }
                                }
                            }
                        }
                        if(isLocToOnLand){
                            var radius = 4;
                            var position = calculateUnitPositionForProvince(province, radius, coast, type);
                            
                            var svgns = "http://www.w3.org/2000/svg",
                            container = document.getElementById( 'svg' );
                            var circle = document.createElementNS(svgns, 'circle');
                            circle.setAttributeNS(null, 'cx', position.x);
                            circle.setAttributeNS(null, 'cy', position.y);
                            circle.setAttributeNS(null, 'r', radius);
                            circle.classList.add(great_power);
            
                            var circleClass = great_power + "_Unit_" + GreatPowerUnitsNum(great_power);
                            circle.classList.add(circleClass);
                            circle.setAttribute("id", "Location_"+province)
                            units.set(circleClass, {"Great_Power":great_power, "Type":type, "Location":province, "Coast":coast})
                            circle.setAttribute("onclick", "isClicked('Location_"+province+"')")
                            container.appendChild(circle);
                            
                            var text = document.createElementNS(svgns, 'text');
                            text.setAttributeNS(null, 'x', position.x-3);
                            text.setAttributeNS(null, 'y', position.y+2);
                            text.setAttributeNS(null, 'fill', '#000');
                            text.setAttributeNS(null, 'font-weight', 'bold');
                            text.setAttributeNS(null, 'id', 'Location_'+province+'_UnitText');
                            text.textContent = 'A';

                            container.appendChild(text); 
                        }
                        else{
                            errorMsg("Invalid: Can't place army on Sea")
                        }
                    }
                    else if(type == "Fleet"){
                        var isLocToProperCoastOrSea = false;
                        var adjacentProvinceList = adjacentProvincesList.get(province);
                        for(var i=0; i < adjacentProvinceList.length; i++){
                            paths.forEach(function (path) {
                                if(path.id == adjacentProvinceList[i] || path.id == province){
                                    for(var j=0; j < path.children.length;j++){
                                        if(path.children[j].classList.contains("w")){
                                            isLocToProperCoastOrSea = true;
                                        }
                                    }
                                }
                            })
                        }
                        if(isLocToProperCoastOrSea){
                            var radius = 4;
                            var position = calculateUnitPositionForProvince(province, radius, coast, type);
                        
                            var svgns = "http://www.w3.org/2000/svg",
                            container = document.getElementById( 'svg' );
                            var circle = document.createElementNS(svgns, 'circle');
                            circle.setAttributeNS(null, 'cx', position.x);
                            circle.setAttributeNS(null, 'cy', position.y);
                            circle.setAttributeNS(null, 'r', radius);
                            circle.classList.add(great_power);
                    
                            var circleClass = great_power + "_Unit_" + GreatPowerUnitsNum(great_power);
                            circle.classList.add(circleClass);
                            circle.setAttribute("id", "Location_"+province)
                            units.set(circleClass, {"Great_Power":great_power, "Type":type, "Location": province, "Coast":coast})
                            circle.setAttribute("onclick", "isClicked('Location_"+province+"')")
                            container.appendChild(circle);

                            var text = document.createElementNS(svgns, 'text');
                            text.setAttributeNS(null, 'x', position.x-2);
                            text.setAttributeNS(null, 'y', position.y+3);
                            text.setAttributeNS(null, 'fill', '#000');
                            text.setAttributeNS(null, 'font-weight', 'bold');
                            text.setAttributeNS(null, 'id', 'Location_'+province+'_UnitText');
                            text.textContent = 'F';

                            container.appendChild(text); 
                        }else{
                            errorMsg("Invalid: Can't place Fleet on Inner Land")
                        }
                    }
                }
            }
        }
        else{
            errorMsg("Invalid: Great Power has not been chosen!");
        }
    }
    else{
        errorMsg("Invalid: Unit has not been chosen!");
    }
}

function calculateUnitPositionForProvince(province, radius = 4, coast, unitType){
    if(document.getElementById(coast).parentElement.children.length > 1 && unitType == "Fleet"){
        var bbox = document.getElementById(coast).getBBox();
        var x = bbox.x + bbox.width/2;
        var y = bbox.y + bbox.height/2;

        //IF CIRCLE INTERSECTS LINE, BRING CLOSER TO TEXT LITTLE BY LITTLE UNTIL IT NO LONGER INTERSECTS
        //HAVE TO MODIFY THIS FOLLOWING CODE TO MOVE THE CIRCLE IN THE RIGHT DIRECTION SO THAT IT'S
        //NOT OUT OF BOUNDS BUT ALSO NOT TOUCHING A LINE

        //IF INTERSECTING LINE, GET THE FURTHEST POINT OF THE POLYGON TO THE CIRCLE 
        //AND MOVE THE CIRCLE HALF OF THEIR DISTANCE APART TOWARDS THAT POINT
        //IF YOU'RE STILL INTERSECTING DO IT AGAIN UNTIL YOU AREN'T
        var finalCirX = x;
        var finalCirY = y;
        //DOESN'T WORK PROPERLY YET
        //MAYBE MAKE SOMETHING THAT GETS A POINT CLOSEST TO PERPENDICULAR OF THE LINE YOU ARE 
        //INTERSECTING OR SOMETHING
        // var isGoodLocation = checkIfCircleIsOutOfBounds(x, y, province, radius);
        // var possible_x = x;
        // var possible_y = y;
        // var furthestPoint = getFurthestPointFromProvincePoints(x, y, coast).get("Point");
        // console.log(furthestPoint);
        // if(!isGoodLocation){
        //     FindPoint:
        //     for(var i=0.0; i < 1; i+=0.1){
        //         var furthestPoint_check = getFurthestPointFromProvincePoints(possible_x, possible_y, coast).get("Point");
        //         if(furthestPoint != furthestPoint_check){
        //             furthestPoint = furthestPoint_check;
        //             i = 0.0;
        //         }
        //         var furthestPointX = furthestPoint.substring(0, furthestPoint.indexOf(","));
        //         var furthestPointY = furthestPoint.substring(furthestPoint.indexOf(",")+1, furthestPoint.length);
        //         var newXYTest = getPositionAlongTheLine(x, y, furthestPointX, furthestPointY, i);
        //         possible_x = newXYTest.x;
        //         possible_y = newXYTest.y;
        //         isGoodLocation = checkIfCircleIsOutOfBounds(possible_x, possible_y, province, radius);
        //         if(isGoodLocation){
        //             finalCirX = possible_x;
        //             finalCirY = possible_y;
        //             break FindPoint;
        //         }
        //     }
        // }
        return {"x":finalCirX, "y":finalCirY};
    }
    else{
        var bbox = document.getElementById(province+"_Text").getBBox();
        var x = bbox.x + bbox.width/2;
        var y = bbox.y + bbox.height/2;

        var dirs = new Array();
        dirs.push({"y":+8}); //down
        dirs.push({"y":-8}); //up
        dirs.push({"x":+12}); //right
        dirs.push({"x":-11}); //left
        //FIND A WAY TO ADD THESE
        //dirs.push({"x":-8}, "y":-9}); //topleft
        //dirs.push({"x":+8}, "y":-9}); //topright
        //dirs.push({"x":-8}, "y":+9}); //bottomleft
        //dirs.push({"x":+8}, "y":+9}); //bottomright
        dirs.push({"y":0}); //middle
        
        var finalCirX = x;
        var finalCirY = y;
        FoundLocation:
        for(var dir=0; dir < dirs.length; dir++){
            var isNotGoodDirection = false;
            var possible_x = x;
            var possible_y = y;
            var province_points = allPoints.get(province);
            for(var i = 0; i < province_points.length-1; i++){
                var province_point2 = (i==province_points.length?0:i+1);
                var y2 = parseInt(province_points[province_point2].substring(province_points[province_point2].indexOf(',')+1, province_points[province_point2].length))
                var y1 = parseInt(province_points[i].substring(province_points[i].indexOf(',')+1, province_points[i].length))
                var x2 = parseInt(province_points[province_point2].substring(0, province_points[province_point2].indexOf(',')))
                var x1 = parseInt(province_points[i].substring(0, province_points[i].indexOf(',')))
                possible_x = x + (dirs[dir].x == null?0:dirs[dir].x)
                possible_y = y + (dirs[dir].y == null?0:dirs[dir].y)

                var distance_from_circle_center = getDotProduct(possible_x, possible_y, x1, y1, x2, y2);
                //var distance_from_circle_center = Math.sqrt(((possible_x-x1)*(possible_x-x1))+((possible_y-y1)*(possible_y-y1)));
                if(distance_from_circle_center < radius){ 
                    isNotGoodDirection = true;
                }
            }
            if(!isNotGoodDirection){
                finalCirX = possible_x;
                finalCirY = possible_y;
                break FoundLocation;
            }
        }
        return {"x":finalCirX, "y":finalCirY};
    }
}

function checkIfCircleIsOutOfBounds(x, y, province, radius){
    // http://alienryderflex.com/polygon/
    var viewbox = document.getElementById("svg").getAttribute("viewBox").split(" ");
    var province_points = allPoints.get(province);
    var LinesTouched = new Map();

    var Point1 = new Map();
    Point1.set("x",viewbox[0]);
    Point1.set("y",y);
    var Point2 = new Map();
    Point2.set("x",viewbox[2]);
    Point2.set("y",y);

    for(var i=0; i < province_points.length; i++){
        var Line = new Map();
        var province_point2_index = i==province_points.length-1?0:i+1;
        var x1 = province_points[i].substring(0, province_points[i].indexOf(","))
        var y1 = province_points[i].substring(province_points[i].indexOf(",")+1, province_points[i].length)
        var x2 = province_points[province_point2_index].substring(0, province_points[province_point2_index].indexOf(","))
        var y2 = province_points[province_point2_index].substring(province_points[province_point2_index].indexOf(",")+1, province_points[province_point2_index].length)

        var Point3 = new Map();
        Point3.set("x",x1);
        Point3.set("y",y1);
        var Point4 = new Map();
        Point4.set("x",x2);
        Point4.set("y",y2);
        if(intersect(Point1,Point2,Point3,Point4)){
            Line.set("x1",x1);
            Line.set("y1",y1);
            Line.set("x2",x2);
            Line.set("y2",y2);
        }
        if(Line.size != 0){
            if(LinesTouched.size != 0){
                var isPresent = false;
                for(var j=0; j < LinesTouched.size; j++){
                    if(Line.get("x1") == LinesTouched.get("Line_"+j).get("x1") &&
                    Line.get("y1") == LinesTouched.get("Line_"+j).get("y1") &&
                    Line.get("x2") == LinesTouched.get("Line_"+j).get("x2") &&
                    Line.get("y2") == LinesTouched.get("Line_"+j).get("y2")){
                    isPresent = true;
                    }
                }
                if(!isPresent){
                    LinesTouched.set("Line_"+LinesTouched.size,Line);
                }
            }
            else{
                LinesTouched.set("Line_"+LinesTouched.size,Line);
            }
        }
    }
    var TestPoint1 = new Map();
    TestPoint1.set("x",x-(radius*2));
    TestPoint1.set("y",y+(radius*2));
    var TestPoint2 = new Map();
    TestPoint2.set("x",x+(radius*2));
    TestPoint2.set("y",y-(radius*2));
    for(var i=0; i < LinesTouched.size; i++){
        var TestPoint3 = new Map();
        TestPoint3.set("x",LinesTouched.get("Line_"+i).get("x1"));
        TestPoint3.set("y",LinesTouched.get("Line_"+i).get("y1"));
        var TestPoint4 = new Map();
        TestPoint4.set("x",LinesTouched.get("Line_"+i).get("x2"));
        TestPoint4.set("y",LinesTouched.get("Line_"+i).get("y2"));
        if(intersect(TestPoint1,TestPoint2,TestPoint3,TestPoint4)){
            LinesTouched.delete("Line_"+i)
        }
    }
    var LinesTouched2 = new Map();
    for(var i=0; i < LinesTouched.size; i++){
        if(LinesTouched.get("Line_"+i).get("x1") > x || LinesTouched.get("Line_"+i).get("x2") > x){
            LinesTouched2.set("Line_"+i, LinesTouched.get("Line_"+i));
            LinesTouched.delete("Line_"+i);
        }
    }
    // console.log(LinesTouched)
    // console.log(LinesTouched2)

    return (LinesTouched.size%2==0 || LinesTouched2.size%2==0)?true:false;
}

function checkIfPointIsOutOfBounds(x, y, province){
    // http://alienryderflex.com/polygon/
    var viewbox = document.getElementById("svg").getAttribute("viewBox").split(" ");
    var province_points = allPoints.get(province);
    var LinesTouched = new Map();

    var Point1 = new Map();
    Point1.set("x",viewbox[0]);
    Point1.set("y",y);
    var Point2 = new Map();
    Point2.set("x",viewbox[2]);
    Point2.set("y",y);

    for(var i=0; i < province_points.length; i++){
        var Line = new Map();
        var province_point2_index = i==province_points.length-1?0:i+1;
        var x1 = province_points[i].substring(0, province_points[i].indexOf(","))
        var y1 = province_points[i].substring(province_points[i].indexOf(",")+1, province_points[i].length)
        var x2 = province_points[province_point2_index].substring(0, province_points[province_point2_index].indexOf(","))
        var y2 = province_points[province_point2_index].substring(province_points[province_point2_index].indexOf(",")+1, province_points[province_point2_index].length)

        var Point3 = new Map();
        Point3.set("x",x1);
        Point3.set("y",y1);
        var Point4 = new Map();
        Point4.set("x",x2);
        Point4.set("y",y2);
        if(intersect(Point1,Point2,Point3,Point4)){
            Line.set("x1",x1);
            Line.set("y1",y1);
            Line.set("x2",x2);
            Line.set("y2",y2);
        }
        if(Line.size != 0){
            if(LinesTouched.size != 0){
                var isPresent = false;
                for(var j=0; j < LinesTouched.size; j++){
                    if(Line.get("x1") == LinesTouched.get("Line_"+j).get("x1") &&
                    Line.get("y1") == LinesTouched.get("Line_"+j).get("y1") &&
                    Line.get("x2") == LinesTouched.get("Line_"+j).get("x2") &&
                    Line.get("y2") == LinesTouched.get("Line_"+j).get("y2")){
                    isPresent = true;
                    }
                }
                if(!isPresent){
                    LinesTouched.set("Line_"+LinesTouched.size,Line);
                }
            }
            else{
                LinesTouched.set("Line_"+LinesTouched.size,Line);
            }
        }
    }
    var TestPoint1 = new Map();
    TestPoint1.set("x",x-3);
    TestPoint1.set("y",y+3);
    var TestPoint2 = new Map();
    TestPoint2.set("x",x+3);
    TestPoint2.set("y",y-3);
    for(var i=0; i < LinesTouched.size; i++){
        var TestPoint3 = new Map();
        TestPoint3.set("x",LinesTouched.get("Line_"+i).get("x1"));
        TestPoint3.set("y",LinesTouched.get("Line_"+i).get("y1"));
        var TestPoint4 = new Map();
        TestPoint4.set("x",LinesTouched.get("Line_"+i).get("x2"));
        TestPoint4.set("y",LinesTouched.get("Line_"+i).get("y2"));
        if(intersect(TestPoint1,TestPoint2,TestPoint3,TestPoint4)){
            LinesTouched.delete("Line_"+i)
        }
    }
    var LinesTouched2 = new Map();
    for(var i=0; i < LinesTouched.size; i++){
        if(LinesTouched.get("Line_"+i).get("x1") > x || LinesTouched.get("Line_"+i).get("x2") > x){
            LinesTouched2.set("Line_"+i, LinesTouched.get("Line_"+i));
            LinesTouched.delete("Line_"+i);
        }
    }
    // console.log(LinesTouched)
    // console.log(LinesTouched2)

    return (LinesTouched.size%2==0 || LinesTouched2.size%2==0)?true:false;
}
// console.log(checkIfPointIsOutOfBounds(450, 250, "St_Petersburg"))

function ccw(A,B,C){
    return (C.get("y")-A.get("y")) * (B.get("x")-A.get("x")) > (B.get("y")-A.get("y")) * (C.get("x")-A.get("x"));
}

function intersect(A,B,C,D){
    return ccw(A,C,D) != ccw(B,C,D) && ccw(A,B,C) != ccw(A,B,D);
}

function getPointsOfPath(province_path){
    var allPathPoints = AllPathPoints();
    return allPathPoints.get(province_path);
}
// console.log(getPointsOfPath("St_Petersburg_NC"))

function IsNegative(num){
    if(num >= 0){
        return false;
    }
    else{
        return true;
    }
}

function getFurthestPointFromProvincePoints(x, y, coast){
    var distances = new Map();
    var allPathPoints = AllPathPoints();
    var province_points = allPathPoints.get(coast);
    for(var i=0; i < province_points.length; i++){
        var x2 = parseInt(province_points[i].substring(0, province_points[i].indexOf(',')))
        var y2 = parseInt(province_points[i].substring(province_points[i].indexOf(',')+1, province_points[i].length))
        var distance = Math.floor(Math.sqrt(((x2-x)*(x2-x))+((y2-y)*(y2-y))))
        distances.set(distance, province_points[i]);
    }
    // console.log(distances)
    var max_distance = 0;
    distances.forEach(function (value, key) {
        if(parseInt(key) > max_distance){
            max_distance = parseInt(key);
        }
    })

    var furthest_distance = new Map();
    for(var i=0; i < province_points.length; i++){
        if(province_points[i] == distances.get(max_distance)){
            furthest_distance.set("Point",distances.get(max_distance));
            furthest_distance.set("Distance",max_distance);
            var x2 = parseInt(province_points[i].substring(0, province_points[i].indexOf(',')))
            var y2 = parseInt(province_points[i].substring(province_points[i].indexOf(',')+1, province_points[i].length))
            furthest_distance.set("XOfMid", (x2+x)/2) //CHANGE THIS TO BE X BECOMES ONE STEP CLOSER ACCORDING TO THE SLOPE
            furthest_distance.set("YOfMid", (y2+y)/2) //CHANGE THIS TO BE Y BECOMES ONE STEP CLOSER ACCORDING TO THE SLOPE
        }
    }

    return furthest_distance;
}

function getPositionAlongTheLine(x1, y1, x2, y2, percentage) {
    // https://newbedev.com/moving-a-point-along-a-line-in-javascript-canvas
    return {x : x1 * (1.0 - percentage) + x2 * percentage, y : y1 * (1.0 - percentage) + y2 * percentage};
}
// var xy = getPositionAlongTheLine(100, 200, 500, 666, 0.5);
// console.log(xy.x, xy.y);

function decimalToFraction(decimal){
    for(var denominator = 1; (decimal * denominator) % 1 !== 0; denominator++);
    return {numerator: decimal * denominator, denominator: denominator};
}
// console.log(decimalToFraction(34/35));

function greatestCommonDenominator(a, b){
    if(!b) return a;
    return greatestCommonDenominator(b, a % b);
}

function getDotProduct(pointX, pointY, x1, y1, x2, y2){
    var slope = (y2-y1)/(x2-x1);
    var b1 = y1-(slope*x1)
    possible_x = pointX
    var denom = (x2-x1);
    possible_y = pointY
    var a = denom*(slope);
    var b = denom;
    var c = denom*b1;
    var distance_from_circle_center = Math.floor(Math.abs(-(a*possible_x) + (b*possible_y) - c)/(Math.sqrt((a*a)+(b*b))))
    //var distance_from_circle_center = Math.sqrt(((possible_x-x1)*(possible_x-x1))+((possible_y-y1)*(possible_y-y1)));

    return distance_from_circle_center;
}

function GreatPowerUnitsNum(great_power){
    var num = 0;
    var usedNums = [];
    units.forEach(function (value, key) {
        if(key.toString().includes(great_power)){
            var first_Occurence = key.substring(key.indexOf('_')+1, key.length)
            usedNums.push(first_Occurence.substring(first_Occurence.indexOf('_')+1, first_Occurence.length));
        }
    })
    usedNums.sort();
    for(var i=0; i<usedNums.length+1;i++){
        if(num != usedNums[i]){
            break;
        }else{
            num++;
        }
    }
    return num.toString();
}

function isClicked(province){
    delRadio();
    if(delChecked){
        deleteUnit(province);
    }
}

var SubmitOrderBtn = document.getElementById("submitOrderBtn");
SubmitOrderBtn.addEventListener('click', function (e) {
    separateOrderText();
})

//GET TO WORK WITH MULTIPLE LINES
function separateOrderText(){
    var moveOrders = document.getElementById("moveTextbox").value.split("\n");
    var moves = new Map();
    for(var i=0; i < moveOrders.length; i++){
        moveOrders[i] = moveOrders[i].trim();
        if(moveOrders[i] == ""){
            continue;
        }
        var unitType = moveOrders[i].substring(0, moveOrders[i].indexOf(" "));
        if(unitType.toUpperCase() == "A" || unitType.toUpperCase() == "ARMY"){
            unitType = "Army";
        }
        else if(unitType.toUpperCase() == "F" || unitType.toUpperCase() == "FLEET"){
            unitType = "Fleet";
        }
        else{
            errorMsg("Invalid Order: Unit Type isn't properly formatted");
        }

        moveOrders[i] = moveOrders[i].substring(moveOrders[i].indexOf(" ")+1, moveOrders[i].length)
        var currLoc = moveOrders[i].substring(0, moveOrders[i].indexOf("-"));

        moveOrders[i] = moveOrders[i].substring(moveOrders[i].indexOf("-")+1, moveOrders[i].length)
        var LocTo = moveOrders[i].substring(0, moveOrders[i].length);

        moves.set(i, {"unit_type":unitType,"current_location":currLoc,"destination_location":LocTo});

    }

    // var allMapTexts = map.querySelectorAll('.map__image text')
    // allMapTexts.forEach(function (value) {
    //     if(value.textContent.toUpperCase() == currLoc.toUpperCase()){
    //         currLoc = value.id.substring(0, value.id.length-5)
    //     }
    //     if(value.textContent.toUpperCase() == LocTo.toUpperCase()){
    //         LocTo = value.id.substring(0, value.id.length-5)
    //     }
    // })

    // var isNextTo = false;
    // adjacentProvincesList.get(currLoc).forEach(function (value) {
    //     if(value == LocTo){
    //         isNextTo = true;
    //     }
    // })
    // if(isNextTo){
    //     var isProperMove = IsProperMove(unitType, currLoc, LocTo);
    //     if(isProperMove){
    //         moveUnit(unitType, currLoc, LocTo);
    //     }
    // }
}

function IsProperMove(unitType, currLoc, LocTo){
    if(unitType == "Army"){
        var isLocToOnLand = false;
        for(var i=0; i < paths.length; i++){
            if(paths[i].id == LocTo){
                for(var j=0; j < paths[i].children.length; j++){
                    if(paths[i].children[j].classList.contains("l")){
                        isLocToOnLand = true;
                    }
                }
            }
        }
        if(isLocToOnLand){
            errorMsg("Invalid Order: Armies can't move into the Sea")
        }
    }
    else if(unitType == "Fleet"){
        var isLocToProperCoastOrSea = false;
        paths.forEach(function (path) {
            if(currLoc == path.id && path.children[0].classList.contains("w")){
                isLocToProperCoastOrSea = true;
            }
        })
        paths.forEach(function (path) {
            if(LocTo == path.id && path.children[0].classList.contains("w")){
                isLocToProperCoastOrSea = true;
            }
        })
        var adjacentProvinceListCurrLoc = adjacentProvincesList.get(currLoc);
        var adjacentProvinceListLocTo = adjacentProvincesList.get(LocTo);
        for(var i=0; i < adjacentProvinceListCurrLoc.length; i++){
            for(var j=0; j < adjacentProvinceListLocTo.length; j++){
                if(adjacentProvinceListCurrLoc[i] == adjacentProvinceListLocTo[j]){
                    paths.forEach(function (path) {
                        if(path.id == adjacentProvinceListLocTo[j]){
                            for(var q=0; q < path.children.length; q++){
                                if(path.children[q].classList.contains("w")){
                                    isLocToProperCoastOrSea = true;
                                }
                            }
                        }
                    })
                }
            }
        }
        if(!isLocToProperCoastOrSea){
            errorMsg("Invalid: Can't place Fleet on Inner Land or From Your Current Coast")
        }
    }
    if(isLocToOnLand || isLocToProperCoastOrSea){
        return true;
    }else{
        return false;
    }
}

function moveUnit(unit_type, current_province, destination_province){
    var unitInDestination = false;
    units.forEach(function (unit) {
        if(unit.Location == destination_province){
            unitInDestination = true;
        }
    })
    units.forEach(function (unit, key) {
        if(!unitInDestination){
            if(unit.Location == current_province){
                if(unit.Type == unit_type){
                    var destination_coast;
                    var pathAdjacents;
                    if(unit.Type == "Army"){
                        pathAdjacents = getArmyAreaAdjacents(unit.Location);
                    }
                    else{
                        pathAdjacents = getFleetPathAdjacents(unit.Coast);
                    }
                    // console.log(pathAdjacents)
                    // console.log(units)
                    pathAdjacents.forEach(function (adjacents) {
                        var province;
                        if(unit.Type == "Army"){
                            var province = document.getElementById(adjacents);
                        }
                        else{
                            province = document.getElementById(adjacents).parentElement;
                        }
                        if(province.id == destination_province){
                            destination_coast = adjacents;
                        }
                    })
                    if(destination_coast != null){
                        var unitCircle = document.getElementById("Location_"+current_province);
                        var destinationPos = calculateUnitPositionForProvince(destination_province, 4, unit.Coast, unit.Type);
                        unitCircle.setAttribute("cx", destinationPos.x);
                        unitCircle.setAttribute("cy", destinationPos.y);
                        unitCircle.setAttribute("id", "Location_"+destination_province);
                        unitCircle.setAttribute("onclick", "isClicked('Location_"+destination_province+"')")

                        var unitText = document.getElementById("Location_"+current_province+"_UnitText");
                        if(unit.Type == "Army"){
                            unitText.setAttribute("x", destinationPos.x-3);
                            unitText.setAttribute("y", destinationPos.y+2);
                        }
                        else{
                            unitText.setAttribute("x", destinationPos.x-2);
                            unitText.setAttribute("y", destinationPos.y+3);
                        }
                        unitText.setAttribute("id", "Location_"+destination_province+"_UnitText");

                        units.set(key, {"Great_Power":unit.Great_Power, "Type":unit.Type, "Location":destination_province, "Coast":destination_coast})
                    }
                    else{
                        errorMsg("Invalid Order: Fleet Cannot Go There From Current Coast Of That Province")
                    }
                }
                else{
                    errorMsg("Invalid Order: Not the same type of Unit")
                }
            }
            else{
                errorMsg("Invalid Order: No Unit in that location")
            }
        }
        else{
            //Does Alert twice for some reason, fix that
            //Temp Alert
            errorMsg("There is already a unit in that location");
        }
    })
}

function deleteUnit(province){
        document.getElementById(province).remove();
        document.getElementById(province+"_UnitText").remove();
        units.forEach(function (value, key) {
            if(value.Location == province.substring(9, province.length)){
                units.delete(key);
            }
        })
}

var addChecked;
function addRadio(){
    var radio = document.getElementById("addRadio");
    if(radio.checked){
        addChecked = true;
    }else{
        addChecked = false;
    }
}

var delChecked;
function delRadio(){
    var radio = document.getElementById("delRadio");
    if(radio.checked){
        delChecked = true;
    }else{
        delChecked = false;
    }
}

function getGreatPowerValue() {
    var greatPowerChecked;
    var ele = document.getElementsByName('Great_Power_Radio');
      
    for(i = 0; i < ele.length; i++) {
        if(ele[i].checked)
            greatPowerChecked = ele[i].value;
    }
    return greatPowerChecked;
}

function getUnitCheckValue() {
    var unitChecked;
    var ele = document.getElementsByName('Unit_Radio');
      
    for(i = 0; i < ele.length; i++) {
        if(ele[i].checked)
            unitChecked = ele[i].value;
    }
    return unitChecked;
}

function getAllPaths(){
    var allPaths = new Map();
    paths.forEach(function (path_group) {
        for(var i=0; i < path_group.children.length; i++){
            var path = path_group.children[i];
            var path_name = path.id;
            var path_points = path.getAttribute('d').replace(/[A-Za-z\n]/g, '');
            allPaths.set(path_name, path_points.split(" "))
        }
    })
    return allPaths;
}
//DOESN'T WORK
function getArmyAreaAdjacents(chosenarea){
    var isNextToArr = new Array();

    if(chosenarea != "Switzerland"){
        if(adjacentProvincesList.get(chosenarea) !== undefined){
            adjacentProvincesList.get(chosenarea).forEach(adjacentProvince=>{
                if(adjacentProvince !== undefined){
                    if(adjacentProvince != "Switzerland") {
                        if(!document.getElementById(adjacentProvince).children[0].classList.contains("w")){
                        isNextToArr.push(adjacentProvince)
                    }
                    } 
                }
            })
        }
    }

    isNextToArr = Array.from(new Set(isNextToArr))

    return isNextToArr;
}
// console.log(getArmyAreaAdjacents("Spain"))

function getFleetPathAdjacents(chosenpath){
    var isNextToArr = new Array();
    var allPaths = getAllPaths();
    allPaths.forEach(function (point, path) {
        if(chosenpath == path){
            allPaths.forEach(function (comparing_point, comparing_path) {
                if(path != comparing_path){
                    PathCheck:
                    for(var i=0; i < point.length; i++){
                        for(var j=0; j < comparing_point.length; j++){
                            if(point[i] === comparing_point[j]){
                                isNextToArr.push(comparing_path);
                                break PathCheck;
                            }
                        }
                    }
                }
            })
        }
    })

    var temp = new Array();
    for(var i=0; i < isNextToArr.length; i++){
        var comparing_point = isNextToArr[i];
        if(comparing_point.substring(0, comparing_point.length-3) != document.getElementById(chosenpath).parentElement.id){
            temp.push(isNextToArr[i]);
        }
    }
    isNextToArr = temp;

    //CHECK IF PATHS NEXT TO EACH OTHER ARE TOUCHING THE SAME BODY OF WATER
    if(!document.getElementById(chosenpath).classList.contains("w")){
        temp = new Array();
        for(var i=0; i < isNextToArr.length; i++){
            var adjacentPathAdjacents = adjacentProvincesList.get(document.getElementById(isNextToArr[i]).parentElement.id);
            if(document.getElementById(isNextToArr[i]).classList.contains("w")){
                temp.push(isNextToArr[i])
                for(var j=0; j < adjacentPathAdjacents.length; j++){
                    if(adjacentPathAdjacents[j] == document.getElementById(chosenpath).parentElement.id){
                        for(var p=0; p < adjacentPathAdjacents.length; p++){
                            for(var q=0; q < isNextToArr.length; q++){
                                if(adjacentPathAdjacents[p] == document.getElementById(isNextToArr[q]).parentElement.id){
                                    temp.push(isNextToArr[q])
                                }
                            }
                        }
                    }
                }
            }
        }
        isNextToArr = temp;
    }

    temp = new Array();
    for(var i=0; i < isNextToArr.length; i++){
        var adjacentPathAdjacents = adjacentProvincesList.get(document.getElementById(isNextToArr[i]).parentElement.id);
        if(document.getElementById(isNextToArr[i]).classList.contains("w")){
            temp.push(isNextToArr[i])
        }else{
            for(var j=0; j < adjacentPathAdjacents.length; j++){
                if(document.getElementById(adjacentPathAdjacents[j]).children[0].classList.contains("w")){
                    temp.push(isNextToArr[i])
                }
            }
        }
    }
    isNextToArr = temp;

    isNextToArr = Array.from(new Set(isNextToArr))

    return isNextToArr;
}
// console.log(getFleetPathAdjacents("BAR"));

function getAllPathAdjacents(){
    var adjacentPathsList = new Map();
    var allPaths = getAllPaths();
    //console.log(allPaths);
    allPaths.forEach(function (point, path) {
        var isNextToArr = new Array();
        allPaths.forEach(function (comparing_point, comparing_path) {
            if(path != comparing_path){
                PathCheck:
                for(var i=0; i < point.length; i++){
                    for(var j=0; j < comparing_point.length; j++){
                        if(point[i] === comparing_point[j]){
                            isNextToArr.push(comparing_path);
                            break PathCheck;
                        }
                    }
                }
            }
        })
        adjacentPathsList.set(path, isNextToArr);
    })
    return adjacentPathsList;
}
// console.log(getPathAdjacents());

function getProvinceFromPath(location){
    var provincePath;
    paths.forEach(function (path) {
        for(var i=0; i < path.children.length; i++){
            if(path.children[i].id == location){
                provincePath = path.children[i].parentElement;
            }
        }
    })
    return provincePath;
}
//console.log(getProvinceFromPath("St_Petersburg_SC"));

function errorMsg(msg){
    document.getElementById("errorMessage").innerHTML = msg;
}
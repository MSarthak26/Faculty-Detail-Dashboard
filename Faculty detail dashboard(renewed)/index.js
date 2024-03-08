import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app=express();
const port=3000;
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    password:"Postgres1234*",
    database:"FDD",
    port:5432
})
db.connect();

async function search_byName(Name){
       let profile=[];
       try{
           const result=await db.query("SELECT * FROM faculty WHERE LOWER(name) = $1",[Name.toLowerCase()]);
           profile=result.rows;
       }
       catch(err){
        console.log("error");
       }
       return profile;
}

async function search_byID(id){
    let profile=[];
    const result=await db.query("SELECT * FROM faculty WHERE LOWER(faculty_id) = $1",[id.toLowerCase()]);
    profile=result.rows;
    return profile;
}

async function getcourse(){
    let courseList=[];
    const result=await db.query("Select course_title,faculty_name FROM courses");
    courseList=result.rows;
    return courseList;
}

async function course_byName(Name){
    let course=[];
    try{
        const result=await db.query("SELECT * FROM courses WHERE LOWER(course_title) = $1",[Name.toLowerCase()]);
        course=result.rows;
    }
    catch(err){
     console.log("error");
    }
    return course;
}

async function course_byID(id){
    let course=[];
    const result=await db.query("SELECT * FROM courses WHERE LOWER(course_id) = $1",[id.toLowerCase()]);
    course=result.rows;
    return course;
}

app.get("/",(req,res)=>{
    res.render("studentHome.ejs");

})

app.post("/searchFaculty",async(req,res)=>{
    let option=req.body.search_by;
    let choice=req.body.search_query.toLowerCase();
    let profile=[];
    if (option=="faculty_id"){
        profile=await search_byID(choice);     
    }
    else{
        profile=await search_byName(choice);
    }
    if (profile.length==0){
        res.send("Enter correct name or id");
    }
    else{
        console.log(profile);
        res.render("profile.ejs",{details:profile});
    }

})

app.get("/facultyDirectory",async(req,res)=>{
     let list=[]; 
     const result=await db.query("SELECT * FROM faculty;");
     list=result.rows;
     res.render("facultyDirectory.ejs",{facultyDirectory:list});
})

app.post("/getprofile",async(req,res)=>{
    let list=[];
    let Fname=req.body.name.toLowerCase();
    list=await search_byName(Fname);
    console.log(list);
    res.render("profile.ejs",{details:list})
})

app.get("/course-listings",async(req,res)=>{
    let courseList=[];
    courseList=await getcourse();
    res.render("courseList.ejs",{list:courseList});
})

app.post("/courseDetail",async(req,res)=>{
    let courseDetail=[];
    let name=req.body.courseName;
    courseDetail=await course_byName(name);
    console.log(courseDetail)
    res.render("courseDetails.ejs",{course:courseDetail});

})

app.post("/searchCourses",async(req,res)=>{
    let option=req.body.search_by;
    let choice=req.body.search_query.toLowerCase();
    let course=[];
    if (option=="course_id"){
        course=await course_byID(choice);     
    }
    else{
        course=await course_byName(choice);
    }
    if (course.length==0){
        res.send("Enter correct name or id");
    }
    else{
        console.log(course);
        res.render("courseDetails.ejs",{course:course});
    }

})

app.listen(port,()=>{
    console.log(`server on port ${port}`);
})
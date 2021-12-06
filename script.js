//infos : https://api.bnf.fr/fr/api-gallica-de-recherche
let gallicaAPIURL   = "https://gallica.bnf.fr/SRU?version=1.2&operation=searchRetrieve&query="
let cql             = "dc.creator";
let operator        = ["all", "any", "adj", "prox"];
let and             = "&";
let separator       = "%20";
let types           = [
    "monographie",
    "carte",
    "image",
    "fascicule",
    "manuscrit",
    "partition",
    "sonore",
    "objet",
    "video"
];
let collapse    = "collapsing=true";
let maxRecord   = "maximumRecords=100";

let request = gallicaAPIURL + cql + separator + operator[0] + separator + "Molière" + and + collapse + and + maxRecord;

LoadData(request)
    .then(data => {
        console.log(request); 
        console.log(data);

        let records = data.getElementsByTagName("srw:record");
        let target  = document.getElementById("datadisplay");
        
        for(let i=0; i<records.length; i++){
            let element = records[i];

            let imageurl    = element.getElementsByTagName("medres")[0].textContent;
            let title       = element.getElementsByTagName("dc:title")[0].textContent;
            let date        = element.getElementsByTagName("dc:date");

            let creators        = element.getElementsByTagName("dc:creator");
            let contributors    = element.getElementsByTagName("dc:contributor");
            let publishers      = element.getElementsByTagName("dc:publisher");

            let container       = document.createElement("div");
            container.id        = `record${i}`;
            container.className = "srwrecord";

            let imgcontainer    = document.createElement("div");
            let infocontainer   = document.createElement("div");

            //img
            let img             = document.createElement("img");
            img.src             = imageurl;
            img.alt             = `Cover of ${title}`
            imgcontainer.appendChild(img);

            //info
            let h1              = document.createElement("h1");
            h1.innerHTML        = `${title}`;
            
            let datepublish     = date.length > 0 ? date[0].textContent : "Date is unknown";
            // let datepublish = "Date is unknown";
            // if(data.length>0){
            //     datepublish = date[0].textContent;
            // }
            let h2              = document.createElement("h2");
            h2.innerHTML        = `${datepublish}`;

            let creatorp        = document.createElement("p");
            creatorp.innerHTML  = `Creators: ${AggregateDataAsString(creators)}`;

            let contribp        = document.createElement("p");
            contribp.innerHTML  = `Contributors: ${AggregateDataAsString(contributors)}`;

            let publishp        = document.createElement("p");
            publishp.innerHTML  = `Publisher: ${AggregateDataAsString(publishers)}`;

            infocontainer.appendChild(h1);
            infocontainer.appendChild(h2);
            infocontainer.appendChild(creatorp);
            infocontainer.appendChild(contribp);
            infocontainer.appendChild(publishp);

            container.appendChild(imgcontainer);
            container.appendChild(infocontainer);
            target.appendChild(container);
        };
    })

function AggregateDataAsString(data){
    let aggregate  = "";
    Array.from(data).forEach(value => {
        aggregate += `${value.textContent}<br>`;
    })

    return aggregate;
}

async function LoadData(request){
    const response  = await fetch(request);
    const rawdata   = await response.text();
    const xml       = await new window.DOMParser().parseFromString(rawdata, "text/xml");
    return xml;
}
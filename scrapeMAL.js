const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

  //set headless to true to hide chromium browser during run
  const browser = await puppeteer.launch({headless: false}); // default is true
  const page = await browser.newPage();

  //Replace Username with your own
  const Username = 'RichkidRich';

  //Navigate to MAL List
  await page.goto(`https://myanimelist.net/animelist/${Username}`);

  //Get the table data
  const data = await page.$$eval('table tr td', tds => tds.map((td) => {
    return td.innerText;
  }));

  //parse out the garbage
  const rows = data.filter(word => word.length>3);
  const midRows = rows.filter(word => word !== "Movie" && word !== "Special");
  const midNameRows = midRows.filter(word => word[2] !== "/");
  const nameRows = midNameRows.filter(word => word[3] !== "/");
  const finalNameRows = nameRows.filter(word => !(word.includes("malSync")));

  //Finely parse out the garbage
  for(let i=0;i<finalNameRows.length;i++){
  	let title = '';
  	for(let j=0;j<finalNameRows[i].length;j++){

  		if(finalNameRows[i][j] !== '\n'){
  			title = title + finalNameRows[i][j];
  		}else{
  			break;
  		}
  	}
    title = title.split(" Watch")[0];
    title = title.split(" Not Yet Aired")[0];
    title = title.split(" (TV)")[0];
    title = title.split(" OVA")[0];
  	finalNameRows[i] = title;
  }

  //add commas
  finalNameRows.forEach((title) => {console.log(title+',')});

  await browser.close();
})();

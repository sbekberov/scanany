module.exports = {

core:
`
# core-plugin used as default
# Commands: map, each, return
# Features: use context references , use constants 

- map:
    - $const: data
      into: var
    
    - $const:
        - a
        - b
        - c
      into: 
        $ref: var

    - $const: toString
      into: format      

    - $ref: data
      into: data1        

- each:
    in:
      $ref: data
    as: $item
    indexed-by: $index      
    into: result       
    apply:
      - map:
          - $ref: $item
            into: res.data
          - $ref: $index
            into: res.index

      - return: res

- return: result                     
`
,
"csv->js->xml->yaml": `


# how to use transform-plugin

# command of data trancform can be use in 
# apply inscturction of transform

# describe csv data as const
# transforms it into js, xml and yaml 


- use: transform-plugin 

- map:
    - $const: >
        var;value

        a;1

        b;2

      into: data  

    - $ref: data
      into: result.inputData

    - $ref: data
      transform: csv->js
      into: result.js

    - $ref: result.js
      transform: js->csv
      into: result.csv
    
    - $ref: result.js
      transform: js->xml
      into: result.xml
    
    - $ref: result.js
      transform: js->yaml
      into: result.yaml
    
- return: result
`
, "xml->js->xml":`
# how to use transform-plugin

# command of data transform can be use in 
# apply inscturction of transform

# describe xml data as const
# transforms it to js ans back to xml 
# also use json.stringify transform of js object to json


- use: transform-plugin 

- map:
    - $const: >
        <node name="root">
          <node name="child">
            text content
          </node>
        </node>
      into: data  

    - $ref: data
      transform: 
        apply:
          - xml->js
          - json.stringify
      into: result.json

    - $ref: data
      transform: 
        apply:
          - xml->js
          - js->xml
      into: result.xml
      

          
- return: result
`

, "yaml->js->yaml":`

# command of data transform can be use in 
# apply inscturction of transform

# describe yaml data as const
# transforms it to js ans back to yaml 
# also use json.stringify transform of js object to json


- use: transform-plugin 

- map:
    - $const: >
        root:
          array:
            - a
            - b
            - c
          string: abc  
      
      into: data  

    - $ref: data
      transform: 
        apply:
          - yaml->js
      into: result.js

    - $ref: result.js
      transform: 
        apply:
          - json.stringify
      into: result.json
    
    
    - $ref: result.js
      transform: 
        apply:
          - js->yaml
      into: result.yaml

          
- return: result
`
, "project & date":`


- map:
    - $const: 
        prop: a
        value:
          - 1
          - 2
          - 3
        createdAt: 2021-05-05  
      into: data
    
    - $ref: data
      transform:
        project: prop
      into: projection.prop
                
    - $ref: data
      transform:
        apply:
          - project: value[1]
      into: projection.value
    
    - $ref: data
      transform:
        apply:
          - project: 
              - prop
              - value[1]
      into: projection.mix
    
    - $ref: data.createdAt
      transform: date
      into: projection.createdAt

    - $const: 2022-01-01
      transform: date
      into: projection.nyd  

    - transform: date
      into: projection.now

    - transform:
        date: 2020-09-16
      into: projection.date1    

- return: projection

`
, "custom rules and trasforms":`

- use: js-plugin


- map:
    $const:
      - source: International Organization for Standardization                                                                          
      - source: Our World in Data                                                                                                       
      - source: COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University                                                                                            
      - source: COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University                                                                                            
      - source: World Bank World Development Indicators, sourced from Food and Agriculture Organization and World Bank estimates                                                                                         
      - source: World Bank World Development Indicators, sourced from International Diabetes Federation, Diabetes Atlas                                                                                                    
      - source: European CDC for European countries / UK Government / HHS for the United States / COVID-19 Tracker for Canada                                                                                          
      - source: United Nations Development Programme (UNDP)                                                                             
      - source: National government reports                                                                                             
      - source: National government reports                                                                                             
      - source: National government reports                                                                                             
      - source: National government reports                                                                                             
    into: data


- js: >
          async (command, context) => {
            let hist = _.groupBy(context.data,"source" )
            
            context.hist = _.orderBy(
                _.keys(hist).map( key => ({
                    source: key,
                    count: hist[key].length 
                })),
                "count",
                "desc"
            )    
            
            return context
          }    

- each:
    in:
      $ref: hist
    as: item
    into: hist
    apply:
      - map:
          $ref: item
          transform:
            js: >
                          (command, context, value) => {
                            value.percents = Math.round(100*value.count/context.data.length)+"%"
                            return value
                          } 
      - return: item               

- return: hist                  

`
, axios:`
# how to use axios-plugin

# HTTP request with axios

- use: axios-plugin 

- axios:
    apply:
      - fetch:
          request:
            method: GET
            url: https://news.ycombinator.com/news
          transform:
            project: data  
          into: data  
- return: data

`
, "axios->docx->js":`
- use: 
    - axios-plugin
    - docx-plugin 

- fetch:
    request:
      method: GET
      headers: 
        accept: application/vnd.openxmlformats-officedocument.wordprocessingml.document
      responseType: arraybuffer  
      url: https://file-examples-com.github.io/uploads/2017/02/file-sample_100kB.docx
    transform:
      apply:
        - project: data
        - docx->js   
    into: result

- return: result                   

`
, "axios->xlsx->js":`

- use: 
    - axios-plugin
    - xlsx-plugin 

- fetch:
    request:
      method: GET
      headers: 
        accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      responseType: arraybuffer  
      url: https://filesamples.com/samples/document/xlsx/sample3.xlsx
    transform:
      apply:
        - project: data
        - xlsx->js   
    into: result

- return: result                   

`
, "axios->pdf->js":`
- use: 
    - axios-plugin
    - pdf-plugin 

- fetch:
    request:
      method: GET
      headers: 
        accept: application/pdf
      responseType: arraybuffer  
      url: https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf
    transform:
      apply:
        - project: data
        - pdf->js   
    into: result

`
, "rss direct": `

- use: rss-plugin 

- rss:
    url: https://rss.unian.net/site/news_rus.rss
    into: feed     

- return: feed    
      

`
," axios -> rss":`

# how to use axios-plugin

# HTTP request with axios

- use: 
    - axios-plugin
    - rss-plugin

- fetch:
    request:
      method: GET
      url: https://www.reddit.com/.rss
    transform:
      apply:
        - project: data
        - rss->js  
    into: rss


- return: rss  
`,
, "cheerio: inspect element":`
- use: 
    - axios-plugin
    - cheerio-plugin

- fetch:
    request:
      method: GET
      url: https://news.ycombinator.com/news
    transform:
      apply:
        - project: data
        - html->page  
    into: page

- once:
    $ref: page
    select: a.titlelink
    apply:
      
      - transform: html
        into: info.html    
      
      - transform: text
        into: info.text    
      
      - transform: class
        into: info.class    
      
      - transform: attributes
        into: info.attributes    

    into: element

- return: info          
          

`
, "cheerio: inspect collection":`

- use: 
    - axios-plugin
    - cheerio-plugin

- fetch:
          request:
            method: GET
            url: https://news.ycombinator.com/news
          transform:
            apply:
              - project: data
              - html->page    
          into: page
     
- all:
    $ref: page
    select: a.titlelink
    into: collection

- each:
    in:
      $ref: collection
    as: element
    into: info
    apply:  
      - map:
          - $ref: element
            transform: html
            into: res.html    
          
          - $ref: element
            transform: text
            into: res.text    
          
          - $ref: element
            transform: class
            into: res.class    
          
          - $ref: element
            transform: attributes
            into: res.attributes

      - return: res          

- return: info        

`
, "headless: page info": `
- use: puppeteer-plugin

- puppeteer:
    apply:
      
      - launch:
          options:
              args:
                - "--no-sandbox" 
                - "--disable-setuid-sandbox"
          as: browser
      
      - new-page:
          $ref: browser
          as: p1
      
      - goto:
          $ref: p1 
          url: https://news.ycombinator.com/news
          options:
            waitUntil: networkidle2
      
      - map:
        
        - $ref: p1
          transform: page.url
          into: info.url
        
        - $ref: p1
          transform: page.title
          into: info.title

        - $ref: p1
          transform: page.metrics
          into: info.metrics
        
        - $ref: p1
          transform: page.cookies
          into: info.cookies

        - $ref: p1
          transform: page.content
          into: info.content


      - close:
          $ref: p1

      - close:
          $ref: browser    
      
      - return: info          

`
, "headless: inspect element": `

- use: puppeteer-plugin

- map:
    $const: https://news.ycombinator.com/news
    into: params.url

- puppeteer:
    apply:
      
      - launch:
          options:
            args:
              - "--no-sandbox" 
              - "--disable-setuid-sandbox"
          as: browser

      - new-page:
          $ref: browser
          as: p1

      - goto:
          $ref: p1 
          url: 
            $ref: params.url
          options:
            waitUntil: networkidle2

      - once:
          $ref: p1
          select: td.title span
          apply:
            - transform: text
              into: info.text
        
            - transform: html
              into: info.html
            
            - transform: attributes
              into: info.attributes
            
            - transform: 
                apply:
                  attributes:
                    - class
                    - id
                    - style
              into: info.aaa
        
            - transform: class
              into: info.class

      - close:
          $ref: browser    

      - return: info          

`
, "headless: inspect collection":`

- use: puppeteer-plugin

- map:
    $const: https://news.ycombinator.com/news
    into: params.url

- puppeteer:
    apply:
      
      - launch:
          options:
            args:
              - "--no-sandbox" 
              - "--disable-setuid-sandbox"
          as: browser
      
      - new-page:
          $ref: browser
          as: p1
      
      - goto:
          $ref: p1 
          url: 
            $ref: params.url
          options:
            waitUntil: networkidle2
      
      - all:
          $ref: p1
          select: a.titlelink
          into: element      

      - each:
          in:
            $ref: element
          as: item
          into: data
          apply:

            - map:
              - $ref: item
                transform: 
                  apply:
                    - text
                into: res.text
              
              - $ref: item
                transform: html
                into: res.html
              
              - $ref: item
                transform: attributes
                into: res.attributes
              
              - $ref: item
                transform: class
                into: res.class

            - return: res  
        
      - close:
          $ref: p1

      - close:
          $ref: browser    
      
      - return: data          

`
, "mysql query":`

- use: mysql-plugin 


- mysql:
    options:
      uri: <<YOUR MYSQL CONNECTION STRING  NOT localhost!!!>>
    apply:
      - execute:
          sql: >
            SELECT 
                product.id,
                product.name,
                producer.name,
                location.name
            FROM product 
                left join producer 
                    on product.producer = producer.id
                left join location
                    on producer.location = location.id
          options:
            nestTables: "."
          
          into: data
      
      - return: data

- return: data                    

`
, "mongodb: list collections":`

- use: mongodb-plugin 


- mongo:
    
    options:
      uri: <<YOUR MONGODB CONNECTION STRING  NOT localhost!!!>>
    
    apply:
      - collections:
          db: covid_nszu 
          into: data

- each:
    in:
      $ref: data
    as: item
    into: collections
    apply:
      - map: 
          $ref: item.name
          into: res.name
      - return: res    



- return: collections                   

`
, "mongodb: find":`

- use: mongodb-plugin 


- mongo:
    
    options:
      uri: <<YOUR MONGODB CONNECTION STRING  NOT localhost!!!>>
    
    apply:
      - find:
          db: covid_nszu
          collection: covid_owid
          query:
            date: "2020-02-24"
            location:
              $in:
                - Afghanistan
                - Argentina
          project:
            _id: 0
            location: 1
            new_cases: 1

          
          into: data

- return: data                   

`
, "mongodb: aggregate":`

- use: mongodb-plugin 


- mongo:
    
    options:
      uri: <<YOUR MONGODB CONNECTION STRING  NOT localhost!!!>>
    
    apply:
      - aggregate:
          db: covid_nszu
          collection: covid_owid_meta
          query:
            - $group:
                _id: $source
            - $project:
                _id: 0
                name: $_id      

          into: data

- each:
    in:
      $ref: data
    as: item
    into: response
    apply:
      - map: 
          $ref: item.name
          transform: lodash.truncate
          into: res.name
      - return: res    

- return: response                   

`

,"http://de.arxiv.org scrapper":`

- use: 
    - axios-plugin
    - cheerio-plugin
    - js-plugin

# prepare input data as params

- map:
    - $const: 
        type: arXiv
        channel: stat.AP
        host: http://de.arxiv.org
      into: params
    
    - $ref: params.channel
      transform:
        js: (command, context, value) => `http://de.arxiv.org/list/${value}/recent`
      into: params.url
    
    - transform:
        apply:
          - date:
          - moment.format: YYYY-MM-DD HH:mm:ss    
      into: params.createdAt          

- log:
    - $const: "URL:"
    - $ref: params.url  

# fetch raw html data from source 

- fetch:
    request:
      method: GET
      url: 
        $ref: params.url
    transform:
      apply:
        - project: data
        - html->$    
    into: page
        
- all:
    $ref: page
    select: span.list-identifier > a[title="Abstract"]
    into: list
        
- each:        
    in:
      $ref: list
    as: item
    into: refs
    apply:
      - map:
          $ref: item
          transform: 
            apply:
              - attributes: href
              - project: href
              - js: (command, context, value) => `${context.params.host}${value}`
          into: res.metadata.href
        
      - log:
          - $const: ">>> "
          - $ref: res.metadata.href

      - fetch:
          request:
            method: GET
            url: 
              $ref: res.metadata.href
          transform:
            apply:
              - project: data
              - html->$    
          into: p
      
      - once:
          $ref: p
          select: div.leftcolumn
          apply:
            - transform: html
              into: res.metadata.html
      
      - once:
          $ref: p
          select: h1.title
          apply:
            - transform: text
              into: d.title        

      - once:
          $ref: p
          select: div.authors
          apply:
            - transform: text
              into: d.authors        

      - once:    
          $ref: p
          select: blockquote.abstract
          apply:
            - transform: text
              into: d.abstract

      - map:
          $ref: d
          transform:
            js: (command, context, value) => `${value.authors}\n${value.title}\n${value.abstract}`
          into: res.metadata.text                

      - once:
          $ref: p
          select: div.dateline
          apply:
            - transform:
                apply:
                  - text
                  - js: (command, context, value) => value.replace("(Submitted on ","").replace(")","") 
                  - moment.date: DD MMM YYYY
                  - moment.format: YYYY-MM-DD HH:mm:ss
              into: res.metadata.publishedAt 

      - map:
          - $ref: params.type
            into: res.type

          - $ref: params.channel
            into: res.channel
          
          - $ref: params.url
            into: res.url
          
          - $ref: params.createdAt
            into: res.createdAt

          - $ref: res.metadata.text
            transform: md5
            into: res.md5                         

      - return: res 

- return: refs                   


`
  
}
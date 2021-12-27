# scanany
scanany Plugable Data Scraper 

## How to use
```sh
git clone https://github.com/boldak/scanany.git
cd scanany
npm install
```
Run examples 
```sh
npm run example <<path to example yaml file>>
```
The example
```sh
npm run example ./examples/yaml/pdf/load.yaml
```
generates output
```sh
---------------------------------------------------------------                                                                   
Scanany example: D:\MOLFAR\1\scanany\examples\yaml\pdf\from-url.yaml                                                              
                                                                                                                                  
- use:                                                                                                                            
    - axios-plugin                                                                                                                
    - transform-plugin                                                                                                            
                                                                                                                                  
- axios:                                                                                                                          
    apply:                                                                                                                        
      - fetch:                                                                                                                    
          request:                                                                                                                
            method: GET                                                                                                           
            headers:                                                                                                              
              accept: application/pdf                                                                                             
            responseType: arraybuffer                                                                                             
            url: https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf                                        
          into: response                                                                                                          
                                                                                                                                  
                                                                                                                                  
- map:                                                                                                                            
    $ref: response.data                                                                                                           
    transform: pdf->js                                                                                                            
    into: result                                                                                                                  
                                                                                                                                  
- return: result                                                                                                                  
                                                                                                                                  
---------------------------------------------------------------                                                                   
Scanany result:                                                                                                                   
                                                                                                                                  
{                                                                                                                                 
  numpages: 4,                                                                                                                    
  numrender: 4,                                                                                                                   
  info: {                                                                                                                         
    PDFFormatVersion: '1.4',                                                                                                      
    IsAcroFormPresent: false,                                                                                                     
    IsXFAPresent: false,                                                                                                          
    Creator: 'Writer',                                                                                                            
    Producer: 'LibreOffice 4.2',                                                                                                  
    CreationDate: "D:20170816144413+02'00'"                                                                                       
  },                                                                                                                              
  metadata: null,                                                                                                                 
  text: '\n' +                                                                                                                    
    '\n' +                                                                                                                        
    'Lorem ipsum \n' +                                                                                                            
    'Lorem ipsum dolor sit amet, consectetur adipiscing \n' +                                                                     
    'elit. Nunc ac faucibus odio. \n' +                                                                                           
    'Vestibulum neque massa, scelerisque sit amet ligula eu, congue molestie mi. Praesent ut\n' +                                 
    'varius sem. Nullam at porttitor arcu, nec lacinia nisi. Ut ac dolor vitae odio interdum\n' +                                 
    'condimentum.  Vivamus dapibus sodales ex, vitae malesuada ipsum cursus\n' +                                                  
    'convallis. Maecenas sed egestas nulla, ac condimentum orci. Mauris diam felis,\n' +                                          
    'vulputate ac suscipit et, iaculis non est. Curabitur semper arcu ac ligula semper, nec luctus\n' +                           
    'nisl blandit. Integer lacinia ante ac libero lobortis imperdiet. Nullam mollis convallis ipsum,\n' +                         
    'ac accumsan nunc vehicula vitae. Nulla eget justo in felis tristique fringilla. Morbi sit amet\n' +                          
    'tortor quis risus auctor condimentum. Morbi in ullamcorper elit. Nulla iaculis tellus sit amet\n' +                          
    'mauris tempus fringilla.\n' +                                                                                                
    'Maecenas mauris lectus, lobortis et purus mattis, blandit dictum tellus.\n' +                                                
    'Maecenas non lorem quis tellus placerat varius. \n' +                                                                       
    'Nulla facilisi. \n' +                                                                                                       
    'Aenean congue fringilla justo ut aliquam. \n' +                                                                             
    'Mauris id ex erat. Nunc vulputate neque vitae justo facilisis, non condimentum ante\n' +                                    
    'sagittis. \n' +                                                                                                              
    'Morbi viverra semper lorem nec molestie. \n' +                                                                              
    'Maecenas tincidunt est efficitur ligula euismod, sit amet ornare est vulputate.\n' +                                        
    'Row 1Row 2Row 3Row 4\n' +                                                                                                    
    '0\n' +                                                                                                                       
    '2\n' +                                                                                                                       
    '4\n' +                                                                                                                       
    '6\n' +                                                                                                                       
    '8\n' +                                                                                                                       
    '10\n' +                                                                                                                      
    '12\n' +                                                                                                                      
    'Column 1\n' +                                                                                                                
    'Column 2\n' +                                                                                                                
    'Column 3\n' +                                                                                                                
    '\n' +                                                                                                                        
    'In non mauris justo. Duis vehicula mi vel mi pretium, a viverra erat efficitur. Cras aliquam\n' +                            
    'est ac eros varius, id iaculis dui auctor. Duis pretium neque ligula, et pulvinar mi placerat\n' +                           
    'et. Nulla nec nunc sit amet nunc posuere vestibulum. Ut id neque eget tortor mattis\n' +                                     
    'tristique. Donec ante est, blandit sit amet tristique vel, lacinia pulvinar arcu. Pellentesque\n' +                          
    'scelerisque fermentum erat, id posuere justo pulvinar ut. Cras id eros sed enim aliquam\n' +                                 
    'lobortis. Sed lobortis nisl ut eros efficitur tincidunt. Cras justo mi, porttitor quis mattis vel,\n' +                      
    'ultricies ut purus. Ut facilisis et lacus eu cursus.\n' +                                                                    
    'In eleifend velit vitae libero sollicitudin euismod. Fusce vitae vestibulum velit. Pellentesque\n' +                         
    'vulputate lectus quis pellentesque commodo. Aliquam erat volutpat. Vestibulum in egestas\n' +                                
    'velit. Pellentesque fermentum nisl vitae fringilla venenatis. Etiam id mauris vitae orci\n' +                                
    'maximus ultricies. \n' +                                                                                                     
    'Cras fringilla ipsum magna, in fringilla dui commodo \n' +                                                                   
    'a.\n' +                                                                                                                      
    'Lorem ipsumLorem ipsumLorem ipsum\n' +                                                                                       
    '1In eleifend velit vitae libero sollicitudin euismod.Lorem\n' +                                                              
    '2Cras fringilla ipsum magna, in fringilla dui commodo\n' +                                                                   
    'a.\n' +                                                                                                                      
    'Ipsum\n' +                                                                                                                   
    '3Aliquam erat volutpat. Lorem\n' +                                                                                           
    '4Fusce vitae vestibulum velit. Lorem\n' +                                                                                    
    '5Etiam vehicula luctus fermentum.Ipsum\n' +                                                                                  
    'Etiam vehicula luctus fermentum. In vel metus congue, pulvinar lectus vel, fermentum dui.\n' +                               
    'Maecenas ante orci, egestas ut aliquet sit amet, sagittis a magna. Aliquam ante quam,\n' +                                   
    'pellentesque ut dignissim quis, laoreet eget est. Aliquam erat volutpat. Class aptent taciti\n' +                            
    'sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut ullamcorper\n' +                                  
    'justo sapien, in cursus libero viverra eget. Vivamus auctor imperdiet urna, at pulvinar leo\n' +                             
    'posuere laoreet. Suspendisse neque nisl, fringilla at iaculis scelerisque, ornare vel dolor. Ut\n' +                         
    'et   pulvinar   nunc.   Pellentesque   fringilla   mollis   efficitur.   Nullam   venenatis   commodo\n' +                   
    'imperdiet. Morbi velit neque, semper quis lorem quis, efficitur dignissim ipsum. Ut ac lorem\n' +                            
    'sed turpis imperdiet eleifend sit amet id sapien.\n' +                                                                       
    '\n' +                                                                                                                        
    'Lorem ipsum dolor sit amet, consectetur adipiscing \n' +                                                                     
    'elit. \n' +                                                                                                                  
    'Nunc ac faucibus odio. Vestibulum neque massa, scelerisque sit amet ligula eu, congue\n' +                                   
    'molestie mi. Praesent ut varius sem. Nullam at porttitor arcu, nec lacinia nisi. Ut ac dolor\n' +                            
    'vitae odio interdum condimentum. Vivamus dapibus sodales ex, vitae malesuada ipsum\n' +                                      
    'cursus convallis. Maecenas sed egestas nulla, ac condimentum orci. Mauris diam felis,\n' +                                   
    'vulputate ac suscipit et, iaculis non est. Curabitur semper arcu ac ligula semper, nec luctus\n' +                           
    'nisl blandit. Integer lacinia ante ac libero lobortis imperdiet. Nullam mollis convallis ipsum,\n' +                         
    'ac accumsan nunc vehicula vitae. Nulla eget justo in felis tristique fringilla. Morbi sit amet\n' +                          
    'tortor quis risus auctor condimentum. Morbi in ullamcorper elit. Nulla iaculis tellus sit amet\n' +                          
    'mauris tempus fringilla.\n' +                                                                                                
    'Maecenas mauris lectus, lobortis et purus mattis, blandit \n' +                                                              
    'dictum tellus. \n' +                                                                                                         
    'Maecenas non lorem quis tellus placerat varius. Nulla facilisi. Aenean congue fringilla justo\n' +                           
    'ut aliquam. Mauris id ex erat. Nunc vulputate neque vitae justo facilisis, non condimentum\n' +                              
    'ante sagittis. Morbi viverra semper lorem nec molestie. Maecenas tincidunt est efficitur\n' +                                
    'ligula euismod, sit amet ornare est vulputate.\n' +                                                                          
    'In non mauris justo. Duis vehicula mi vel mi pretium, a viverra erat efficitur. Cras aliquam\n' +                            
    'est ac eros varius, id iaculis dui auctor. Duis pretium neque ligula, et pulvinar mi placerat\n' +                           
    'et. Nulla nec nunc sit amet nunc posuere vestibulum. Ut id neque eget tortor mattis\n' +                                     
    'tristique. Donec ante est, blandit sit amet tristique vel, lacinia pulvinar arcu. Pellentesque\n' +                          
    'scelerisque fermentum erat, id posuere justo pulvinar ut. Cras id eros sed enim aliquam\n' +                                 
    'lobortis. Sed lobortis nisl ut eros efficitur tincidunt. Cras justo mi, porttitor quis mattis vel,\n' +                      
    'ultricies ut purus. Ut facilisis et lacus eu cursus.\n' +                                                                    
    'In eleifend velit vitae libero sollicitudin euismod. \n' +                                                                   
    'Fusce vitae vestibulum velit. Pellentesque vulputate lectus quis pellentesque commodo.\n' +                                  
    'Aliquam erat volutpat. Vestibulum in egestas velit. Pellentesque fermentum nisl vitae\n' +                                   
    'fringilla venenatis. Etiam id mauris vitae orci maximus ultricies. Cras fringilla ipsum\n' +                                 
    'magna, in fringilla dui commodo a.\n' +                                                                                      
    'Etiam vehicula luctus fermentum. In vel metus congue, pulvinar lectus vel, fermentum dui.\n' +                               
    'Maecenas ante orci, egestas ut aliquet sit amet, sagittis a magna. Aliquam ante quam,\n' +                                   
    'pellentesque ut dignissim quis, laoreet eget est. Aliquam erat volutpat. Class aptent taciti\n' +                            
    'sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut ullamcorper\n' +                                  
    'justo sapien, in cursus libero viverra eget. Vivamus auctor imperdiet urna, at pulvinar leo\n' +                             
    'posuere laoreet. Suspendisse neque nisl, fringilla at iaculis scelerisque, ornare vel dolor. Ut\n' +                         
    'et   pulvinar   nunc.   Pellentesque   fringilla   mollis   efficitur.   Nullam   venenatis   commodo\n' +                   
    'imperdiet. Morbi velit neque, semper quis lorem quis, efficitur dignissim ipsum. Ut ac lorem\n' +                            
    'sed turpis imperdiet eleifend sit amet id sapien.\n' +                                                                       
    '\n',                                                                                                                         
  version: '1.10.100'                                                                                                             
}                                                                                                                                 
---------------------------------------------------------------   
```



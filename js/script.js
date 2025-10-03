$(document).ready(function(){

    htmlString = '';
    offset = 0;

    function getData(link, type){
        $.ajax({
            url: link,
            type: 'GET',   
            success: function (response){
                switch(type) {
                    case ('reward'):
                        $('#reward').text(response);
                        break;
                    case ('participants'):
                        $('#totalParticipantNumber').text(response);
                        break; 
                    case ('transactions'):
                        $('#totalAmount').text((response.totalAmount*Math.pow(10, -8)).toFixed(3));
                        
                        for(let i = 0; i < response.transfers.length; i++){
                            let date = new Date(response.transfers[i].date);
                            let adr ='';
                            let month=['января', 'февраля', 'марта', 'апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
                            let monthEn=['January', 'February', 'March', 'April','May','June','July','August','September','October','November','December'];
                            if (window.screen.width<=575){
                                adr=response.transfers[i].address.substr(0,5)+"..."+response.transfers[i].address.substr(-6,6);
                            }
                            else if (window.screen.width>575){
                                adr=response.transfers[i].address.substr(0,8)+"..."+response.transfers[i].address.substr(-6,6);
                            }
                            if ($('#dropdown-item').text() == 'РУС'){

                                htmlString+='<tr class="text-white"><th data-label="#" scope="row">'+ (i+1).toString() 
                                +'</th><td data-label="RUBTC, Адрес">'+adr+'</td><td data-label="Сумма, RUBTC">'+Math.floor(response.transfers[i].amount*Math.pow(10, -8)* Math.pow(10, 5)) / Math.pow(10, 5)
                                +'</td><td data-label="Дата">'+date.getDate()+" "+ month[date.getMonth()]+" "+date.getFullYear()
                                +'</td><td><a class="text-dark-green" href="http://russian-explorer.nationalbitcoin.org/tx/'
                                +response.transfers[i].transaction_id+'" target="_blank">Подробнее</a></td></tr>';
                            }
                            else htmlString+='<tr class="text-white"><th data-label="#" scope="row">'+ (i+1).toString() 
                            +'</th><td data-label="RUBTC address">'+adr+'</td><td data-label="Amount, RUBTC">'+Math.floor(response.transfers[i].amount*Math.pow(10, -8)* Math.pow(10, 5)) / Math.pow(10, 5)
                            +'</td><td data-label="Date">'+date.getDate()+" "+ monthEn[date.getMonth()]+" "+date.getFullYear()
                            +'</td><td><a class="text-dark-green" href="http://russian-explorer.nationalbitcoin.org/tx/'
                            +response.transfers[i].transaction_id+'" target="_blank">See details</a></td></tr>';
                        }
                        $('tbody').html(htmlString);
                        $('#left').text((18347513 - response.totalAmount*Math.pow(10, -8)).toLocaleString('ru-RU').replace(',', '.'));

                        rows = response.transfers.length
                        offset += rows
                        if (rows == 1000) {
                            // all is ok, next page...
                            getData('https://prxdrx.org/backend/api/v1/rubtc/get-transfers-info?limit=1000&offset=0&coin=RUBTC' + offset, 'transactions');
                        } else {
                            // the end...
                            $('#table').DataTable({
                                searching: false,
                                ordering:  false,
                                select: false,
                                info: false,
                                lengthChange: false,
                                pageLength: 18,
                                "dom": '<"row"t<"col-sm-3"><"col-sm-5 text-center"p><"col-sm-3">>',
                                "oLanguage": {
                                    "oPaginate": {
                                        "sNext": "&raquo;",
                                        "sPrevious": "&laquo;",
                                    }
                                }
                            });
                        }

                        break;
                }
            }
        });
    }

    getData('https://prxdrx.org/backend/api/v1/rubtc/rubtc-award-amount', 'reward');
    getData('https://prxdrx.org/backend/api/v1/rubtc/distribution-participants-with-transfers?coin=RUBTC', 'participants');
    getData('https://prxdrx.org/backend/api/v1/rubtc/get-transfers-info?limit=1000&offset=0&coin=RUBTC', 'transactions');    
});

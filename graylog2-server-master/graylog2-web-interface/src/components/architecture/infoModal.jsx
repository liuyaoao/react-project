import React from 'react';

require('!script!../../../public/javascripts/bootstrap-table-dist/bootstrap-table.min.js');
require('!script!../../../public/javascripts/bootstrap-table-dist/locale/bootstrap-table-zh-CN.min.js');
// require('!style/useable!css!../../../public/javascripts/bootstrap-table-dist/bootstrap-table.min.css')

var data = [
    {quotaName:'名称', quotaValue:'xx设备'},
    {quotaName:'IP地址', quotaValue:'192.168.1.1'},
    {quotaName:'MAC地址', quotaValue:'00-23-5A-15-99-42'},
    {quotaName:'端口', quotaValue:'3000'}
];

const InfoModal = React.createClass({
    componentDidMount() {
        $('#infoTable').bootstrapTable({
            columns: [
                {
                    field: 'quotaName',
                    width: 120,
                    sortable: false
                }, {
                    field: 'quotaValue',
                    sortable: false
                }
            ],
            data: data
        });
    },
    render() {
        return (
            <div className="modal fade" id="infoModal" tabIndex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
                <div className="modal-dialog infoModalDialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h5 className="modal-title">详细信息</h5>
                        </div>
                        <div className="modal-body">
                            <table id='infoTable'
                                   data-toggle='table'
                                   data-classes='table table-no-bordered table-striped table-hover'>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-sm btn-success" data-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});

export default InfoModal;

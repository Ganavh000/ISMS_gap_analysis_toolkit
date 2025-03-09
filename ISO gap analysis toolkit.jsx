import React, { useState } from "react";
import { Button, Table, Select } from "antd";
import { FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import controlsData from "./controls.json";

const { Option } = Select;

const GapAnalysisTool = () => {
  const [data, setData] = useState(controlsData);

  const handleStatusChange = (value, key) => {
    const newData = data.map((item) =>
      item.key === key ? { ...item, status: value } : item
    );
    setData(newData);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gap Analysis");
    XLSX.writeFile(wb, "gap_analysis.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: "#gapTable" });
    doc.save("gap_analysis.pdf");
  };

  const columns = [
    {
      title: "Control",
      dataIndex: "control",
      key: "control",
    },
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          value={text}
          onChange={(value) => handleStatusChange(value, record.key)}
        >
          <Option value="Implemented">Implemented</Option>
          <Option value="Planning">Planning to be Implemented</Option>
          <Option value="Not Implemented">Not Implemented</Option>
          <Option value="Partially Implemented">Partially Implemented</Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <h2>ISO 27001 Gap Analysis Toolkit</h2>
      <Table id="gapTable" dataSource={data} columns={columns} pagination={false} />
      <Button onClick={exportToExcel} icon={<FileExcelOutlined />}>Export to Excel</Button>
      <Button onClick={exportToPDF} icon={<FilePdfOutlined />}>Export to PDF</Button>
    </div>
  );
};

export default GapAnalysisTool;

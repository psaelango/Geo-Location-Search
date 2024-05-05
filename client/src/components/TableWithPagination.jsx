import React, { useState, useEffect } from "react";
import { Container, Table, Pagination } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getLocationsByPage } from "../store/location/locationService";

const TableWithPagination = ({ fields, url, onRowSelect }) => {
  const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageGroup, setPageGroup] = useState([]);
  const [selected, setSelected] = useState({});
  const maxPageLinks = 5;

  const fetchData = async () => {
    try {
      const data = await getLocationsByPage(user, `?page=${currentPage}`);
      const { locations = [], totalPages = 1 } = data;
      setData(locations);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    calculatePageGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  const onRowClick = (row) => {
    setSelected(row);
    onRowSelect(row);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const calculatePageGroup = () => {
    const currentGroup = Math.ceil(currentPage / maxPageLinks);

    const startPage = (currentGroup - 1) * maxPageLinks + 1;
    const endPage = Math.min(startPage + maxPageLinks - 1, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    setPageGroup(pages);
  };

  const handleNextGroup = () => {
    const nextGroupFirstPage = Math.min(
      currentPage + maxPageLinks,
      totalPages - maxPageLinks + 1,
    );
    setCurrentPage(nextGroupFirstPage);
  };

  const handlePreviousGroup = () => {
    const previousGroupFirstPage = Math.max(currentPage - maxPageLinks, 1);
    setCurrentPage(previousGroupFirstPage);
  };

  return (
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            {fields.map((field, index) => (
              <th key={index}>{field.heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((value, index) => {
            const active = JSON.stringify(value) === JSON.stringify(selected);
            return (
              <tr
                key={index}
                className={active ? "active-row" : ""}
                onClick={() => onRowClick(value)}
              >
                <td>{currentPage * 10 - 10 + index + 1}</td>
                {fields.map((field) => (
                  <th className="">{value[field.key]}</th>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} />
        <Pagination.Prev
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        />
        {currentPage > maxPageLinks && (
          <Pagination.Ellipsis onClick={handlePreviousGroup} />
        )}
        {pageGroup.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}
        {currentPage + maxPageLinks <= totalPages && (
          <Pagination.Ellipsis onClick={handleNextGroup} />
        )}
        <Pagination.Next
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
        />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
      </Pagination>
    </Container>
  );
};

export default TableWithPagination;

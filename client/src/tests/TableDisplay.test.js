import { render, screen } from "@testing-library/react";
import TableDisplay from "../components/TableDisplay";
import locationMock from "./mocks/locationMock.json";

const tableFields = [
  {
    heading: "Country",
    key: "country",
  },
  {
    heading: "Latitude",
    key: "latitude",
  },
  {
    heading: "Longitude",
    key: "longitude",
  },
  {
    heading: "Zip Code",
    key: "zip_code",
  },
];

const rowData = {
  street: "115 Zboncak Center",
  city: "Fort Lauderdale",
  zip_code: "90119-2214",
  county: "Northumberland",
  country: "Christmas Island",
  latitude: -45.619,
  longitude: -7.017,
  time_zone: "Africa/Harare",
  location: {
    type: "Point",
    coordinates: [-7.017, -45.619],
  },
};

test("renders table with all data", () => {
  render(<TableDisplay data={locationMock} fields={tableFields} />);
  const rows = screen.getAllByRole("row");
  expect(rows.length).toBe(101);
});

test("renders table with proper fields", () => {
  render(<TableDisplay data={locationMock} fields={tableFields} />);
  const element = screen.getAllByText(/Christmas Island/i);
  expect(element[0]).toBeInTheDocument();
});

test("renders table with row highlighted", () => {
  const { container } = render(
    <TableDisplay
      data={locationMock}
      fields={tableFields}
      highlight={rowData}
    />,
  );
  const element = container.querySelector(".active-row");
  expect(element).toBeTruthy();
});

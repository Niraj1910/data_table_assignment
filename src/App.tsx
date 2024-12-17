import { useEffect, useRef, useState } from "react";
import CustomPagination from "./components/CustomPagination";

interface resultType {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface paginationType {
  current_page: number;
  limit: number;
  next_url: string;
  prev_url: string;
  offset: number;
  total: number;
  total_pages: number;
}

interface DataType {
  pagination: paginationType;
  data: resultType[];
}

const App = () => {
  const [page, setPage] = useState(1);
  const [serverData, setServerData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const searchedSelectedRow = useRef<HTMLInputElement | null>(null);
  const selectedRowsRef = useRef<resultType[]>([]); // Use ref to keep track of selected rows

  const fetchData = async () => {
    setLoading(true);
    const resp = await fetch(
      `https://api.artic.edu/api/v1/artworks?page=${page}`
    );
    const result: DataType = await resp.json();
    const { pagination, data } = result;
    setServerData({
      pagination: pagination,
      data: data,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSelectRows = async () => {
    if (searchedSelectedRow.current) {
      let rowsToSelect = parseInt(searchedSelectedRow.current.value);
      let selectedRowsCount = selectedRowsRef.current.length;

      while (
        rowsToSelect > selectedRowsCount &&
        page <= (serverData?.pagination.total_pages || 1)
      ) {
        await fetchData();
        const currentData = serverData?.data || [];

        const remainingRowsToSelect = rowsToSelect - selectedRowsCount;
        const rowsToSelectFromCurrentPage = Math.min(
          remainingRowsToSelect,
          currentData.length
        );

        selectedRowsRef.current = [
          ...selectedRowsRef.current,
          ...currentData.slice(0, rowsToSelectFromCurrentPage),
        ];

        selectedRowsCount = selectedRowsRef.current.length;
        if (selectedRowsCount < rowsToSelect) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    }
  };

  const rowClassName = (index: number) => {
    return index % 2 === 0 ? "bg-gray-50" : "";
  };

  const popUp = () => (
    <div className="absolute bg-white shadow-md border rounded-md p-4 z-20 w-64">
      <div className="flex justify-between items-center mb-4">
        <span className="font-normal text-base">Select Rows</span>
        <button
          onClick={() => setShowPopUp(false)}
          className="text-gray-500 text-sm"
        >
          Close
        </button>
      </div>
      <input
        ref={searchedSelectedRow}
        type="number"
        placeholder="Enter number of rows"
        className="border rounded-md w-full p-2 mb-4 text-sm"
      />
      <button
        onClick={handleSelectRows}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full text-sm"
      >
        Select
      </button>
    </div>
  );

  return (
    <div className="w-screen h-screen bg-slate-50 flex flex-col items-center p-4">
      <div className="w-[1000px] bg-white shadow-xl rounded-md overflow-hidden relative">
        <table className="table-auto w-full">
          <thead className="bg-blue-50 font-serif text-black sticky top-0 z-10">
            <tr>
              <th className="p-4 w-8">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked && serverData?.data) {
                      selectedRowsRef.current = serverData.data;
                    } else {
                      selectedRowsRef.current = []; // Deselect all rows
                    }
                  }}
                  checked={
                    serverData?.data?.length ===
                      selectedRowsRef.current.length &&
                    selectedRowsRef.current.length > 0
                  }
                />
              </th>

              <th className="p-4 text-left w-[20%] relative">
                <span
                  onClick={() => setShowPopUp(true)}
                  className="cursor-pointer hover:bg-blue-100 rounded-full"
                >
                  🔻
                </span>
                Title
                {showPopUp && (
                  <div className="absolute top-full left-0 mt-2">{popUp()}</div>
                )}
              </th>
              <th className="p-4 text-left w-[15%]">Place</th>
              <th className="p-4 text-left w-[25%]">Artist</th>
              <th className="p-4 text-left w-[20%]">Inscriptions</th>
              <th className="p-4 text-left w-[10%]">Start Date</th>
              <th className="p-4 text-left w-[10%]">End Date</th>
            </tr>
          </thead>
        </table>

        {loading ? (
          <p className="w-full text-center py-2 text-xl">Loading...</p>
        ) : (
          <div className="h-[500px] overflow-y-auto">
            <table className="table-auto w-full">
              <tbody>
                {serverData?.data.map((row, index) => (
                  <tr
                    key={index}
                    className={`${rowClassName(index)} hover:bg-blue-50`}
                  >
                    <td className="p-4 w-8">
                      <input
                        type="checkbox"
                        checked={selectedRowsRef.current.some(
                          (selectedRow) => selectedRow.title === row.title
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            selectedRowsRef.current.push(row);
                          } else {
                            selectedRowsRef.current =
                              selectedRowsRef.current.filter(
                                (selectedRow) => selectedRow.title !== row.title
                              );
                          }
                        }}
                      />
                    </td>
                    <td className="p-4 w-[20%]">{row.title}</td>
                    <td className="p-4 w-[15%]">{row.place_of_origin}</td>
                    <td className="p-4 w-[25%]">{row.artist_display}</td>
                    <td className="p-4 w-[20%]">{row.inscriptions}</td>
                    <td className="p-4 w-[10%]">{row.date_start}</td>
                    <td className="p-4 w-[10%]">{row.date_end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Custom Paginator */}
        <div className="p-4">
          {serverData && (
            <CustomPagination
              total_pages={serverData.pagination.total_pages}
              page={page}
              setPage={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

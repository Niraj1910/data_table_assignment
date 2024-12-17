import { Dispatch, SetStateAction, useState } from "react";

const CustomPagination = ({
  total_pages,
  page,
  setPage,
}: {
  total_pages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) => {
  const [PageButtons, setPageButtons] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);

  const handlePageClick = (clickedPage: number) => {
    setPage(clickedPage);

    const firstPage = PageButtons[0];
    const lastPage = PageButtons[9];

    if (clickedPage === firstPage) {
      if (firstPage === 1) return;

      setPageButtons((prev) => {
        const updatedPageButtons = prev;
        updatedPageButtons.unshift(clickedPage - 1);
        updatedPageButtons.pop();
        return updatedPageButtons;
      });
    }

    if (clickedPage === lastPage) {
      if (lastPage === total_pages) return;
      setPageButtons((prev) => {
        const updatedPageButtons = prev;
        updatedPageButtons.shift();
        updatedPageButtons.push(clickedPage + 1);
        console.log(updatedPageButtons);
        return updatedPageButtons;
      });
    }
  };

  return (
    <div className=" flex justify-between items-center mt-6">
      {/* Prev Button */}
      <button
        onClick={() => handlePageClick(page - 1)}
        // disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {PageButtons.map((val) => (
          <button
            key={val}
            onClick={() => handlePageClick(val)}
            className={`px-3 py-1 rounded-md text-sm ${
              page === val
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 hover:bg-blue-100"
            }`}
          >
            {val}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageClick(page + 1)}
        // disabled={lastPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;

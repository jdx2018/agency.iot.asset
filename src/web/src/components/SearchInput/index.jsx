import React from "react";
import matchSorter from "match-sorter";
import { Input } from "antd";

const { Search } = Input;

export default React.memo(function ({ data, onFilterDataChange, columns }) {
  const handleSearch = React.useCallback(
    (value) => {
      return onFilterDataChange(
        value
          ? matchSorter(data, value.trim(), {
            keys: columns.map((column) => column.dataIndex),
            threshold: matchSorter.rankings.CONTAINS
          })
          : data, value
      );
    },
    [columns, data, onFilterDataChange]
  );

  const handleChange = React.useCallback((e) => {
    if (e.target.value === '') {
      handleSearch('')
    }
  }, [handleSearch])

  return <Search onChange={handleChange} placeholder="键入搜索..." onSearch={handleSearch} enterButton />;
});

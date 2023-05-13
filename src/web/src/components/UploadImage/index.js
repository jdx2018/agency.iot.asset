import React, { useState, useCallback, useMemo, memo } from "react";
import ImageUploading from "react-images-uploading";
import ImageViewer from "react-simple-image-viewer";
import { makeStyles } from "@material-ui/core/styles";
import { defaultImage } from "./image";
import Button from "@material-ui/core/Button";

function UploadImage(props) {
  const {
    width,
    height,
    maxImageNums,
    onChange,
    value,
    singleImgMaxSize,
    disabled,
    multiple,
  } = props;
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const classes = useStyle();

  const onImageUpload = useCallback(
    (imageList, addUpdateIndex) => {
      onChange(imageList.map((item) => item.data_url));
    },
    [onChange]
  );

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = useCallback(() => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  }, []);

  const errorsTips = useCallback(
    (errors, files) => {
      const { maxFileSize, maxNumber } = errors;
      if (maxFileSize) {
        global.$showMessage({
          message: "单张图片不允许超过" + singleImgMaxSize + "M",
          autoHideDuration: 5000,
          type: "error",
        });
        return;
      }
      if (maxNumber) {
        global.$showMessage({
          message: "图片数量不允许超过" + maxImageNums + "张",
          autoHideDuration: 5000,
          type: "error",
        });
      }
    },
    [singleImgMaxSize, maxImageNums]
  );

  const images = useMemo(() => {
    if (value) {
      if (Array.isArray(value)) {
        return value.map((item) => {
          return {
            data_url: item,
          };
        });
      } else {
        return [{ data_url: value }];
      }
    }
    return [
      // {
      //   data_url: "",
      // },
    ];
  }, [value]);

  return (
    <div
      className={classes.container}
      style={{
        width: width,
        minHeight: height,
      }}
    >
      <ImageUploading
        multiple={multiple}
        value={images}
        onChange={onImageUpload}
        maxNumber={maxImageNums}
        dataURLKey="data_url"
        onError={errorsTips}
        maxFileSize={singleImgMaxSize * M} //单张图片的大小
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          errors,
        }) => (
          <div>
            {imageList.map((image, index) => (
              <div
                key={index}
                className={classes.imgItem}
                style={{
                  width: 100,
                  height: 100,
                }}
              >
                <img
                  src={image.data_url}
                  alt=""
                  width={100}
                  height={100}
                  onClick={openImageViewer.bind(null, index)}
                  className={classes.img}
                />
                {disabled === false && (
                  <span
                    style={{ top: 0 }}
                    onClick={onImageUpdate.bind(null, index)}
                  >
                    更换
                  </span>
                )}
                {disabled === false && (
                  <span
                    style={{ bottom: 0 }}
                    onClick={onImageRemove.bind(null, index)}
                  >
                    删除
                  </span>
                )}
              </div>
            ))}
            {imageList.length === 0 && (
              <div
                className={classes.imgItem}
                style={{
                  width: 100,
                  height: 100,
                  border: "none",
                }}
              >
                <img
                  src={defaultImage}
                  style={{ border: "1px solid #ddd" }}
                  alt=""
                  width={100}
                  height={100}
                />
              </div>
            )}

            {multiple === true &&
              imageList.length < maxImageNums &&
              disabled === false && (
                <Button
                  variant="outlined"
                  size="small"
                  color="inherit"
                  onClick={onImageUpload}
                  className={classes.button}
                >
                  选择图片
                </Button>
              )}

            {multiple === false &&
              imageList.length === 0 &&
              disabled === false && (
                <Button
                  variant="outlined"
                  size="small"
                  color="inherit"
                  onClick={onImageUpload}
                  className={classes.button}
                >
                  选择图片
                </Button>
              )}
          </div>
        )}
      </ImageUploading>

      {isViewerOpen && (
        <ImageViewer
          src={value}
          currentIndex={currentImage}
          onClose={closeImageViewer}
        />
      )}
    </div>
  );
}

const useStyle = makeStyles((theme) => {
  return {
    container: {
      display: "inline-block",
      verticalAlign: "top",
      "& > .react-simple-image-viewer__modal": {
        zIndex: 20,
      }
    },
    imgItem: {
      display: "inline-block",
      verticalAlign: "bottom",
      position: "relative",
      marginRight: 5,
      marginBottom: 5,
      //border: "1px solid rgba(0, 0, 0, 0.22)",
      "&>span": {
        position: "absolute",
        width: "100%",
        backgroundColor: "rgba(5, 5 , 5, 0.3)",
        textAlign: "center",
        lineHeight: "30px",
        left: 0,
        color: "rgba(240, 240 , 240, 0.7)",
        cursor: "pointer",
      },
      "&>span:last-child": {},
      "&>span:first-child": {
        top: 0,
      },
    },
    img: {
      objectFit: "cover",
    },
    button: {
      color: "#666",
      border: "1px solid #ddd",
      marginBottom: 5,
    },
  };
});

UploadImage.defaultProps = {
  width: 300,
  height: 120,
  maxImageNums: 5,
  onChange: (imageList) => { },
  value: [],
  singleImgMaxSize: 5, //单张图片的大小, 单位为M.
  disabled: false,
  multiple: false,
};

const M = 1048576;

export default memo(UploadImage);

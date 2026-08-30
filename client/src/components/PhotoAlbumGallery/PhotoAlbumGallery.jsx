import React from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { CloudUploadOutlined, Favorite, FavoriteBorder } from "@mui/icons-material";
import { normalizeImageUrl } from "../../services/ApiService";

export const PhotoAlbumGallery = ({
  images = [],
  baseImage = null,
  onUpload,
  onBaseImageChange,
  viewOnly = false,
  loading = false,
  title = "Images",
  emptyText = "No images uploaded yet",
  accept = "image/*",
}) => {
  const fileInputRef = React.useRef(null);

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (onUpload) {
      await onUpload(files);
    }

    event.target.value = "";
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>

        {!viewOnly && (
          <Button
            variant="outlined"
            size="small"
            startIcon={loading ? <CircularProgress color="inherit" size={16} /> : <CloudUploadOutlined />}
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload
          </Button>
        )}
      </Stack>

      {!viewOnly && (
        <input ref={fileInputRef} type="file" accept={accept} multiple hidden onChange={handleUpload} />
      )}

      {images.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 1.5,
          }}
        >
          {images.map((imageUrl, index) => {
            const normalizedImageUrl = normalizeImageUrl(imageUrl);
            const isBaseImage = !!baseImage && normalizeImageUrl(baseImage) === normalizedImageUrl;

            return (
              <Card
                key={`${normalizedImageUrl}-${index}`}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 2,
                  border: isBaseImage ? "2px solid" : "1px solid",
                  borderColor: isBaseImage ? "warning.main" : "divider",
                  bgcolor: "background.paper",
                }}
              >
                <CardMedia
                  component="img"
                  image={normalizedImageUrl}
                  alt={`Image ${index + 1}`}
                  sx={{ width: "100%", height: 130, objectFit: "cover" }}
                />

                {!viewOnly && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "rgba(0, 0, 0, 0.50)",
                    }}
                  >
                    <Box
                      component="button"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (onBaseImageChange) onBaseImageChange(normalizedImageUrl);
                      }}
                      sx={{
                        border: "none",
                        background: "transparent",
                        color: isBaseImage ? "warning.main" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        p: 0,
                        m: 0,
                      }}
                    >
                      {isBaseImage ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                    </Box>
                  </Box>
                )}

                {isBaseImage && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 8,
                      bottom: 8,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: "warning.main",
                      color: "warning.contrastText",
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    Base
                  </Box>
                )}
              </Card>
            );
          })}
        </Box>
      ) : (
        <Box
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            px: 2,
            py: 3,
            textAlign: "center",
            bgcolor: "rgba(0, 0, 0, 0.02)",
          }}
        >
          <Typography color="text.secondary">{emptyText}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default PhotoAlbumGallery;

import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";

const ShareButton = ({ gameId, fromBaseUrl }) => {
  const [snackBar, setSnackBar] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBar(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const getBaseUrl = () => {
    const currentUrl = window.location.href;
    const i = currentUrl.lastIndexOf("/");

    return currentUrl.substring(0, i);
  };

  const shareUrl = async () => {
    const baseUrl = fromBaseUrl ? window.location.href : getBaseUrl();
    const link = `${baseUrl}?gameId=${gameId}`;

    const shareData = {
      title: "TicTac Arena",
      text: "Join my 1v1 TicTac Arena game match!",
      url: link,
    };
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log(error);
        navigator.clipboard.writeText(link);
        setSnackBar(true);
      }
    } else {
      navigator.clipboard.writeText(link);
      setSnackBar(true);
    }
  };

  return (
    <>
      <Tooltip title="Share Game Link / Copy to Clipboard" arrow placement="top">
        <IconButton
          size="medium"
          aria-label="Share Application Link"
          onClick={shareUrl}
          sx={{
            color: "#14b8a6",
            background: "rgba(20, 184, 166, 0.1)",
            border: "1px solid rgba(20, 184, 166, 0.3)",
            borderRadius: "10px",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: "rgba(20, 184, 166, 0.25)",
              boxShadow: "0 0 15px rgba(20, 184, 166, 0.4)",
              transform: "scale(1.05)",
            },
          }}
        >
          {navigator.share ? <ShareIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      <Snackbar
        open={snackBar}
        autoHideDuration={3000}
        message="Game invite link copied to clipboard! 📋"
        onClose={handleClose}
        action={action}
        ContentProps={{
          sx: {
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(20, 184, 166, 0.4)",
            borderRadius: "12px",
            backdropFilter: "blur(12px)",
            color: "#14b8a6",
            fontWeight: 600,
          },
        }}
      />
    </>
  );
};

export default ShareButton;


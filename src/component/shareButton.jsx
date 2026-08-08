import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";

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
      title: "TicToe By rsaw409",
      text: "Join This Multiplayer Game With Me.",
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
      <IconButton
        size="large"
        aria-label="Share Application Link"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={shareUrl}
        sx={{ color: "green" }}
      >
        <ShareIcon />
      </IconButton>

      <Snackbar
        open={snackBar}
        autoHideDuration={3000}
        message="Share Not Supported... Link copied in clipboard!"
        onClose={handleClose}
        action={action}
      />
    </>
  );
};

export default ShareButton;

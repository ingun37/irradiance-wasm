import * as React from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export default function InputImage(props: {
  onFile: (buf: Uint8Array) => void;
}) {
  const [imageURL, setImageURL] = useState("/venetian_crossroads_1k.hdr");
  const [file, setFile] = useState<File | null>(null);
  return (
    <Stack spacing={2} direction="row">
      <Item>
        <TextField
          value={imageURL}
          label="image url"
          onChange={(e) => setImageURL(e.target.value)}
        />
        <Button
          onClick={() => {
            fetch(imageURL)
              .then((x) => x.arrayBuffer())
              .then((buf) => props.onFile(new Uint8Array(buf)));
          }}
        >
          Fetch
        </Button>
      </Item>
      <Item>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <Button
          onClick={() => {
            if (file !== null) {
              file
                .arrayBuffer()
                .then((buf) => props.onFile(new Uint8Array(buf)));
            }
          }}
        >
          Upload
        </Button>
      </Item>
    </Stack>
  );
}

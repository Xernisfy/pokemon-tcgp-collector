interface PackProps {
  setLink: string;
  name: string;
}

export function Pack(props: PackProps) {
  if (!props.name) return <></>;
  return (
    <img
      class="packImage"
      src={`/api/image?path=${props.setLink}/${props.name}.png`}
    />
  );
}

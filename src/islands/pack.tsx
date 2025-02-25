interface PackProps {
  setLink: string;
  name: string;
}

export function Pack(props: PackProps) {
  if (!props.name) return null;
  return (
    <img
      class="pack-image"
      src={`/api/image?path=${props.setLink}/${props.name}.png`}
    />
  );
}

import { useState } from 'react';

export default function useStaff() {
  const [staff, setStaff] = useState([]);
  return { staff };
}

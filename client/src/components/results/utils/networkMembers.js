import config from "../../../config/config.json";

export async function fetchNetworkMembers(authHeaders = {}) {
  try {
    const response = await fetch(`${config.apiUrl}/services`, {
      headers: authHeaders,
    });
    if (!response.ok) throw new Error("Failed to fetch network members");
    const data = await response.json();
    return data.services || [];
  } catch (error) {
    console.error("Error fetching network members:", error);
    return [];
  }
}

export async function fetchNetworkMembersWithMaturity(networkMembers, authHeaders = {}) {
  const updatedMembers = await Promise.all(
    networkMembers.map(async (member) => {
      try {
        const res = await fetch(`${member.url}/configuration`, {
          headers: authHeaders,
        });
        if (!res.ok) throw new Error(`Failed to fetch ${member.url}`);
        const data = await res.json();
        return {
          ...member,
          maturity: data.maturityAttributes?.productionStatus || "Undefined",
        };
      } catch (err) {
        console.warn(`Error fetching configuration for ${member.url}:`, err);
        return { ...member, maturity: "Undefined" };
      }
    })
  );
  return updatedMembers;
}

export async function loadNetworkMembersWithMaturity(authHeaders = {}) {
  const members = await fetchNetworkMembers(authHeaders);
  return await fetchNetworkMembersWithMaturity(members, authHeaders);
}

import axios from "axios";
import {v4 as uuidv4} from "uuid";

const SCHEMA_REGISTRY_BASE_URL = "http://localhost:8081";

beforeAll(async () => {
  // Ensure Schema Registry is live
  await axios.get(`${SCHEMA_REGISTRY_BASE_URL}/schemas/types`);
});

describe("FORWARD | additionalProperties = false:", () => {
  it("adding optional: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "FORWARD");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected:", e.response.status);
      return true;
    }
  });

  it("adding mandatory: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "FORWARD");

    registeredSchema.required.push("C");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected:", e.response.status);
      return true;
    }
  });

  it("removing mandatory: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "FORWARD");

    delete registeredSchema.required;
    delete registeredSchema.properties.A;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected:", e.response.status);
      return true;
    }
  });

  it("removing optional: allowed", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "FORWARD");

    delete registeredSchema.properties.B;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
    } catch (e) {
      fail(`Update failed ${e.response.status}`);
    }
  });
});

describe("FORWARD | additionalProperties = true:", () => {
  it("adding optional: allowed", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "FORWARD");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
    } catch (e) {
      fail(`Update failed ${e.response.status}`);
    }
  });

  it("adding mandatory: allowed", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "FORWARD");

    registeredSchema.required.push("C");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
    } catch (e) {
      fail(`Update failed ${e.response.status}`);
    }
  });

  it("removing mandatory: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "FORWARD");

    delete registeredSchema.required;
    delete registeredSchema.properties.A;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected:", e.response.status);
      return true;
    }
  });

  it("removing optional: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "FORWARD");

    delete registeredSchema.properties.B;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected:", e.response.status);
      return true;
    }
  });
});

describe("BACKWARD | additionalProperties = false:", () => {
  it("adding optional: allowed", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "BACKWARD");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
    } catch (e) {
      fail(`Update failed ${e.response.status}`);
    }
  });

  it("adding mandatory: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "BACKWARD");

    registeredSchema.required.push("C");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected:", e.response.status);
      return true;
    }
  });

  it("removing mandatory: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "BACKWARD");

    delete registeredSchema.required;
    delete registeredSchema.properties.A;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected:", e.response.status);
      return true;
    }
  });

  it("removing optional: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(false, "BACKWARD");

    delete registeredSchema.properties.B;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected:", e.response.status);
      return true;
    }
  });
});

describe("BACKWARD | additionalProperties = true:", () => {
  it("adding optional: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "BACKWARD");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected:", e.response.status);
      return true;
    }
  });

  it("adding mandatory: forbidden", async () => {
    const {schemaId, registeredSchema} = await setBaseSchema(true, "BACKWARD");

    registeredSchema.required.push("C");

    registeredSchema.properties["C"] = {
      type: "string",
    };

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
      fail("Succeeded unexpectedly.");
    } catch (e) {
      console.log("Failed as expected:", e.response.status);
      return true;
    }
  });

  it("removing mandatory: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "BACKWARD");

    delete registeredSchema.required;
    delete registeredSchema.properties.A;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
    } catch (e) {
      fail(`Update failed ${e.response.status}`);
    }
  });

  it("removing optional: forbidden", async () => {
    const { schemaId, registeredSchema } = await setBaseSchema(true, "BACKWARD");

    delete registeredSchema.properties.B;

    try {
      await setOrUpdateSchema(schemaId, registeredSchema);
    } catch (e) {
      fail(`Update failed ${e.response.status}`);
    }
  });
});

const setBaseSchema = async (
  setAdditionalProperties: boolean,
  compatibility: "FORWARD" | "BACKWARD"
): Promise<{schemaId: string, registeredSchema: any}> => {
  const schemaId = uuidv4();

  const schemaToRegister = {
      required: ["A"],
      properties: {
        A: {
          type: "string",
        },
        B: {
          type: "string",
        },
      },
      additionalProperties: setAdditionalProperties,
  };

  await setOrUpdateSchema(schemaId, schemaToRegister);

  await axios.put(`${SCHEMA_REGISTRY_BASE_URL}/config/${schemaId}`, { compatibility: compatibility });

  return { schemaId: schemaId, registeredSchema: schemaToRegister };
};

const setOrUpdateSchema = async (id: string, schema: any) => {
  console.debug("Registering: \n", schema);

  await axios.post(
    `${SCHEMA_REGISTRY_BASE_URL}/subjects/${id}/versions`,
    {
      schema: JSON.stringify(schema),
      schemaType: "JSON",
    },
    { headers: { "Content-Type": "application/vnd.schemaregistry.v1+json" } }
  );
};

import { useState } from "react";
import { toast } from "react-toastify";
import useFetch from "../../../../hooks/useFetch.js";
import BusinessList from "./BusinessList.jsx";
import BusinessDetail from "./BusinessDetail.jsx";
import BusinessForm from "./BusinessForm.jsx";
import InviteEmployeeModal from "./InviteEmployeeModal.jsx";
import storeAuth from "../../../../context/storeAuth.jsx";


const BusinessManagement = () => {
  const { fetchDataBackend } = useFetch();
  const { user: userData } = storeAuth();


  const [view, setView] = useState("list");
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [businessToEdit, setBusinessToEdit] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedBusinessForInvite, setSelectedBusinessForInvite] =
    useState(null);

  const handleOpenRegisterForm = () => {
    setView("register");
  };

  const handleSelectBusiness = (id, action) => {
    setSelectedBusinessId(id);
    if (action === "view") {
      setView("detail");
    } else if (action === "edit") {
      const fetchBusinessToEdit = async () => {
        try {
          const url = `${import.meta.env.VITE_API_URL}/negocios/detail/${id}`;
          const response = await fetchDataBackend(url, null, "GET");
          if (response) {
            setBusinessToEdit(response);
            setView("edit");
          } else {
            toast.error("No se pudo cargar la información para editar.");
          }
        } catch (err) {
          toast.error("Error al cargar el negocio para editar.");
        }
      };
      fetchBusinessToEdit();
    }
  };

  const handleRegisterNewBusiness = async (data) => {
    try {
      const formData = new FormData();
      formData.append("emailBoss", userData.email);
      formData.append("companyName", data.companyName);
      formData.append("ruc", data.ruc);
      formData.append("categoria", data.categoria);
      formData.append("telefono", data.telefono);
      formData.append("direccion", data.direccion);
      formData.append("emailNegocio", data.emailNegocio);
      formData.append("descripcion", data.descripcion);
      if (data.image && data.image[0]) {
        formData.append("foto", data.image[0]);
      }
      const url = `${import.meta.env.VITE_API_URL}/negocios/create`;
      await fetchDataBackend(url, formData, "POST");
      toast.success("Negocio registrado exitosamente.");
      setView("list");

    } catch (error) {
      console.error("Error al registrar negocio:", error);
      toast.error(error.message || "Error al registrar el negocio.");
    }
  };

  const handleInviteEmployee = (business) => {
    setSelectedBusinessForInvite(business);
    setIsInviteModalOpen(true);
  };

  const handleRegisterNewEmployee = async (data) => {
    try {
      if (!selectedBusinessForInvite) {
        throw new Error("No hay negocio seleccionado para invitar.");
      }

      const payload = {
        emailEmpleado: data.email,
        emailJefe: userData.email,
        // id: selectedBusinessForInvite._id,
        companyCode: selectedBusinessForInvite.companyCode,
      };

      const url = `${import.meta.env.VITE_API_URL}/negocios/add-employee`;
      const response = await fetchDataBackend(url, payload, "POST");

      if (response && response.msg) {
        setIsInviteModalOpen(false);
        toast.success(response.msg || "Empleado invitado exitosamente");
      }
    } catch (error) {
      console.error("Error al registrar empleado:", error);
      let errorMessage = "Error al registrar el empleado";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleUpdateBusiness = async (data) => {
    try {
      const formData = new FormData();
      formData.append("companyName", data.companyName);
      formData.append("ruc", data.ruc);
      formData.append("categoria", data.categoria);
      formData.append("telefono", data.telefono);
      formData.append("direccion", data.direccion);
      formData.append("emailNegocio", data.emailNegocio);
      formData.append("descripcion", data.descripcion);
      if (data.image && data.image[0]) {
        formData.append("foto", data.image[0]);
      }

      const url = `${import.meta.env.VITE_API_URL}/negocios/update/${
        businessToEdit._id
      }`;
      await fetchDataBackend(url, formData, "PUT");
      toast.success("Negocio actualizado exitosamente.");
      setView("list");
      setBusinessToEdit(null);
    } catch (error) {
      console.error("Error al actualizar negocio:", error);
      toast.error(error.message || "Error al actualizar el negocio.");
    }
  };

  const renderContent = () => {
    switch (view) {
      case "list":
        return (
          <BusinessList
            onSelectBusiness={handleSelectBusiness}
            onOpenRegisterForm={handleOpenRegisterForm}
            onInviteEmployee={handleInviteEmployee}
          />
        );
      case "register":
        return (
          <BusinessForm
            onSave={handleRegisterNewBusiness}
            onCancel={() => setView("list")}
          />
        );
      case "detail":
        return (
          <BusinessDetail
            businessId={selectedBusinessId}
            onBack={() => setView("list")}
          />
        );
      case "edit":
        return (
          <BusinessForm
            initialData={businessToEdit}
            onSave={handleUpdateBusiness}
            onCancel={() => setView("list")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
      {isInviteModalOpen && (
        <InviteEmployeeModal
          onSave={handleRegisterNewEmployee}
          onCancel={() => setIsInviteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BusinessManagement;
